import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { generateToken } from "../utils/jwt.js";
import passport from "../config/passport.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", passport.authenticate("github",
    {
        session: true,
        failureRedirect: "/api/auth/github/error"
    }),
    (req, res) => {
        const token = generateToken(req.user);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 14 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            status: "success",
            user: {
                id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role
            }
        });
    });

router.get("/github/error", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "Error al autenticar con GitHub"
    });
});

export default router;