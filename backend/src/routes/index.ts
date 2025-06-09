import { Router } from 'express';
import categoryRoutes from './categories';
import adminRoutes from './admin';
import productsRoutes from './products';
import bannersRoutes from './banners';

const router = Router();

// Ruta de prueba/salud
router.get('/healthcheck', (_req, res) => {
  res.json({
    message: '🚀 API La Vitrina v1.0',
    status: 'active'
  });
});

// Rutas de la API
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productsRoutes);
router.use('/banners', bannersRoutes);

// Manejador de rutas no encontradas
// router.use(':', (_req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: 'La ruta solicitada no existe'
//   });
// });

export default router;