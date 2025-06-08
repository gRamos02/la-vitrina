import { Router } from "express";
import { createCategory, deleteCategory } from "../../controllers/categories";
import { verifyAdmin } from "../../middlewares/auth";

const router = Router();

// Crear categoría
router.post("/", verifyAdmin, createCategory);
router.delete("/:id", verifyAdmin, deleteCategory);

export default router;

