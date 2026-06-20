import bcrypt from "bcrypt";
import UserDAO from "../dao/userDAO.js";
import passport from "../config/passport.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: "Todos los campos son obligatorios",
                });
        }
        const existingUser = await UserDAO.getByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ status: "error", message: "El email ya está registrado" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserDAO.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
        });
        const userWithoutPassword = { name, email, role };
        res
            .status(200)
            .json({
                status: "success",
                message: "Usuario creado correctamente",
                userWithoutPassword,
            });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const login = async (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return res
                .status(500)
                .json({ status: "error", message: "Error al loguearse" });
        }
        if (!user) {
            return res
                .status(401)
                .json({ status: "error", message: "Email o contraseña incorrectos" });
        }
        const token = generateToken(user);
        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });

        const userWithoutPassword = {
            name: user.name,
            email: user.email,
            role: user.role,
        };
        res.status(200).json({
            status: "success",
            message: "Usuario logueado correctamente",
            token,
            userWithoutPassword,
        });
    })(req, res, next);
};

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ status: "error", message: "Error al cerrar sesión" });
            }
            res.clearCookie("authToken", {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.clearCookie("connect.sid", {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            });
            res
                .status(200)
                .json({
                    status: "success",
                    message: "Usuario deslogueado correctamente",
                });
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
