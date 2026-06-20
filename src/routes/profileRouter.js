import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";


const router = Router();

router.get("/", authMiddleware, (req, res) => {
    res.status(200).json({
        status: "success",
        mesagge: "Informacion del perfil",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        }
    });
});

router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({
        status: "success",
        mesagge: "Informacion del perfil",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        }
    });
});

export default router;



