import dotenv from "dotenv";

dotenv.config();

const requiderEnvVars = ["JWT_SECRET", "MONGO_URI"];

requiderEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`La variable de entorno ${key} es requerida`);
    }
});

export const config = {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtCookieName: process.env.JWT_COOKIE_NAME,
};
