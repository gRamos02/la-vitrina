//Ruta de categorias
import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/categories';

const router = Router();

// Ruta para obtener todas las categorías
router.get('/', getCategories);
router.post('/', createCategory)

export default router;