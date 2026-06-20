import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export { generateToken, verifyToken };
