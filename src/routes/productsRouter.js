import { Router } from "express";
import { getProduct, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getProduct);
router.get("/:pid", getProductById);
router.post("/", authMiddleware, createProduct);
router.put("/:pid", authMiddleware, updateProduct);
router.delete("/:pid", authMiddleware, deleteProduct);

export default router;
