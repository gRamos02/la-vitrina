import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../../controllers/products";
import { verifyAdmin } from "../../middlewares/auth";
import { handleUploadError, upload } from "../../middlewares/upload";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdminProducts
 *   description: Gestión de productos por administradores
 */

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categories
 *             properties:
 *               name:
 *                 type: string
 *                 example: Figura de acción
 *               description:
 *                 type: string
 *                 example: Figura articulada de colección
 *               price:
 *                 type: number
 *                 example: 29.99
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: https://example.com/image.jpg
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60f5a4e7c1c9b70017ebc2a3
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  verifyAdmin,
  upload.array("images", 10),
  handleUploadError,
  createProduct
);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/:id",
  verifyAdmin,
  upload.array("images"),
  handleUploadError,
  updateProduct
);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
