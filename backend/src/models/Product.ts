import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del producto
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         description:
 *           type: string
 *           description: Descripción detallada del producto
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del producto
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de URLs de imágenes del producto
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de las categorías a las que pertenece el producto
 *         stock:
 *           type: integer
 *           description: Cantidad de unidades disponibles en inventario
 *         isActive:
 *           type: boolean
 *           description: Indica si el producto está activo y visible
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación automática
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización automática
 *       example:
 *         _id: 60c72b2f5f1b2c001c8d4567
 *         name: "Figura de Goku Super Saiyajin"
 *         description: "Figura de colección de Goku en modo Super Saiyajin de 20 cm"
 *         price: 29.99
 *         images:
 *           - "https://lavitrina.com/images/goku1.jpg"
 *           - "https://lavitrina.com/images/goku2.jpg"
 *         categories:
 *           - "60c72b1a5f1b2c001c8d1234"
 *         stock: 50
 *         isActive: true
 *         createdAt: "2025-06-08T03:20:00.000Z"
 *         updatedAt: "2025-06-08T03:21:00.000Z"
 */

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String, // URL de la imagen
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
