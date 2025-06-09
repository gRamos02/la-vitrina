import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - title
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: Título principal del banner
 *           example: "Oferta Especial"
 *         subtitle:
 *           type: string
 *           description: Subtítulo o descripción secundaria
 *           example: "Descuentos hasta 50%"
 *         image:
 *           type: string
 *           description: URL de la imagen del banner
 *           example: "https://example.com/images/banner.jpg"
 *         cta:
 *           type: string
 *           description: Texto del botón de llamada a la acción
 *           default: "Ver más"
 *           example: "Comprar ahora"
 *         ctaLink:
 *           type: string
 *           description: URL de destino al hacer clic en el CTA
 *           example: "/productos/ofertas"
 *         bgColor:
 *           type: string
 *           description: Clases de Tailwind para el gradiente de fondo
 *           default: "from-[#FF3C3B] to-[#FF8C42]"
 *         order:
 *           type: number
 *           description: Orden de aparición del banner
 *           default: 0
 *         isActive:
 *           type: boolean
 *           description: Estado de activación del banner
 *           default: true
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio de visualización
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de finalización de visualización (opcional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true, // URL de la imagen
    },
    cta: {
      type: String,
      default: 'Ver más',
      trim: true,
    },
    ctaLink: {
      type: String,
      trim: true, // URL a donde redirige el CTA
    },
    bgColor: {
      type: String,
      default: 'from-[#FF3C3B] to-[#FF8C42]', // Clases de Tailwind para gradiente
    },
    order: {
      type: Number,
      default: 0, // Para ordenar los banners
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date, // Opcional, para banners temporales
    },
  },
  {
    timestamps: true,
  }
);

// Índice para mejorar performance en consultas
bannerSchema.index({ isActive: 1, order: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;