import { Strategy as GithubStrategy } from "passport-github2";
import UserDAO from "../dao/userDAO.js";

const githubStrategy = new GithubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
            let user = await UserDAO.getByGithubId(profile.id);
            if (user) {
                return done(null, user);
            }
            user = await UserDAO.getByEmail(email);
            if (user) {
                user = await UserDAO.update(user._id, { githubId: profile.id });
                return done(null, user);
            }
            const newUser = await UserDAO.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                role: "user",
                githubId: profile.id
            });
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    });

export default githubStrategy;
