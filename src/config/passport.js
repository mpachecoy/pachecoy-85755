import passport from "passport";
import localStrategy from "../strategies/localStrategy.js";
import jwtStrategy from "../strategies/jwtStrategy.js";
import githubStrategy from "../strategies/githubStrategy.js";
import User from "../models/userModel.js";

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);
passport.use("github", githubStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
