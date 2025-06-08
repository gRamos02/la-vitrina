import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: ID único de la categoría
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Nombre único de la categoría
 *           minLength: 1
 *           maxLength: 100
 *           example: "Electrónicos"
 *         icon:
 *           type: string
 *           description: Icono representativo de la categoría (opcional)
 *           example: "electronics-icon"
 *         description:
 *           type: string
 *           description: Descripción detallada de la categoría (opcional)
 *           maxLength: 500
 *           example: "Productos electrónicos y tecnológicos"
 *         parent:
 *           type: string
 *           format: objectId
 *           description: ID de la categoría padre (para subcategorías)
 *           example: "507f1f77bcf86cd799439012"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la categoría
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2024-01-20T14:45:00.000Z"
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "Smartphones"
 *         icon: "phone-icon"
 *         description: "Teléfonos inteligentes de última generación"
 *         parent: "507f1f77bcf86cd799439012"
 *         createdAt: "2024-01-15T10:30:00.000Z"
 *         updatedAt: "2024-01-20T14:45:00.000Z"
 * 
*/

export interface ICategory extends Document {
  name: string;
  icon?: string;
  description?: string;
  parent?: mongoose.Types.ObjectId; // Referencia a otra categoría
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
    },
    description: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true, 
  }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
