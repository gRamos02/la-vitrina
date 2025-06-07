//Ruta de categorias
import { Router } from 'express';
import { getCategories } from '../controllers/categories';

const router = Router();

// Ruta para obtener todas las categorías
router.get('/', getCategories);

export default router;