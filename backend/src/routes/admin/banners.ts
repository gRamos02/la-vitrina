import { Router } from "express";
import {
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  getBannerById,
} from "../../controllers/banners";
import { verifyAdmin } from "../../middlewares/auth";
import { handleUploadError, upload } from "../../middlewares/upload";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdminBanners
 *   description: Gestión de banners por administradores
 */

/**
 * @swagger
 * /admin/banners:
 *   post:
 *     summary: Crear un nuevo banner
 *     tags: [AdminBanners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Oferta Especial"
 *               subtitle:
 *                 type: string
 *                 example: "Descuentos hasta 50%"
 *               image:
 *                 type: string
 *                 format: binary
 *               cta:
 *                 type: string
 *                 example: "Comprar ahora"
 *               ctaLink:
 *                 type: string
 *                 example: "/productos/ofertas"
 *               bgColor:
 *                 type: string
 *                 example: "from-[#FF3C3B] to-[#FF8C42]"
 *               order:
 *                 type: number
 *                 example: 1
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Banner creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  verifyAdmin,
  upload.single("image"),
  handleUploadError,
  createBanner
);

/**
 * @swagger
 * /admin/banners/{id}:
 *   put:
 *     summary: Actualizar un banner existente
 *     tags: [AdminBanners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del banner a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               cta:
 *                 type: string
 *               ctaLink:
 *                 type: string
 *               bgColor:
 *                 type: string
 *               order:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Banner actualizado exitosamente
 *       404:
 *         description: Banner no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/:id",
  verifyAdmin,
  upload.single("image"),
  handleUploadError,
  updateBanner
);

/**
 * @swagger
 * /admin/banners/{id}:
 *   delete:
 *     summary: Eliminar un banner
 *     tags: [AdminBanners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del banner a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner eliminado exitosamente
 *       404:
 *         description: Banner no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", verifyAdmin, deleteBanner);

export default router;
