import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Directorio de almacenamiento
const uploadDir = path.join(__dirname, '../../uploads');

// Asegurarse que la carpeta existe con los permisos correctos
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    // Verificar permisos de escritura
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      cb(null, uploadDir);
    } catch (error) {
      cb(new Error('No hay permisos de escritura en el directorio de uploads'), uploadDir);
    }
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // Limpiar nombre de archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    
    // Verificar extensión
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!allowedExtensions.includes(ext)) {
      cb(new Error('Tipo de archivo no permitido'), filename);
      return;
    }

    cb(null, filename);
  },
});

// Configuración de multer con límites y filtros
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // máximo 10 archivos
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Verificar tipo MIME
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Tipo de archivo no permitido'));
      return;
    }
    cb(null, true);
  }
});

// Middleware para manejar errores de multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        message: 'Demasiados archivos. Máximo 10'
      });
    }
  }
  
  if (err.message === 'Tipo de archivo no permitido') {
    res.status(400).json({
      success: false,
      message: 'Solo se permiten archivos de imagen (jpg, png, gif, webp)'
    });
  }

  next(err);
};
