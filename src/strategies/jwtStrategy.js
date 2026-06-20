import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserDAO from "../dao/userDAO.js";
import dotenv from "dotenv";
dotenv.config();

const cookieOrHeaderExtractor = (req) => {
    if (req?.cookies?.authToken) return req.cookies.authToken;
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: cookieOrHeaderExtractor,
        secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
        try {
            const user = await UserDAO.getByEmail(payload.email);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
);

export default jwtStrategy;