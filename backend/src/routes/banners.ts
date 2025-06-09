import { Router } from 'express';
import { getAllBanners, getBannerById } from '../controllers/banners';

const router = Router();

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Obtener todos los banners activos
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Lista de banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */
router.get('/', getAllBanners);

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     summary: Obtener un banner por ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del banner
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner no encontrado
 */
router.get('/:id', getBannerById);

export default router;