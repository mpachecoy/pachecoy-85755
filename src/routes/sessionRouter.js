import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
    res.status(200).json({
        status: "success", session: {
            id: req.sessionID,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                rol: req.user.rol
            },
            cookie: req.session.cookie
        }
    });
});

export default router;
