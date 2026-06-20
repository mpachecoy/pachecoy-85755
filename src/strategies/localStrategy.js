import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import UserDAO from "../dao/userDAO.js";

const localStrategy = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const user = await UserDAO.getByEmail(email);
        if (!user) {
            return done(null, false, { message: "Email no registrado" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: "Contraseña incorrecta" });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

export default localStrategy;