import { Router } from 'express';
import adminCategoriesRouter from './categories';
import usersRouter from './users';
import productsRouter from './products';
// import authMiddleware from '../../middleware/auth';

const router = Router();

// Middleware de autenticación para todas las rutas de admin
// router.use(authMiddleware);

// Rutas de administración
router.use('/categories', adminCategoriesRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);

export default router;