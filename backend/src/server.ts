import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mainRouter from './routes';
import { setupSwagger } from './config/swagger';
import path from 'path';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: '*', // ⚠️ Solo para desarrollo, no producción
  optionsSuccessStatus: 200
};


// Middleware
app.use(morgan('dev')); // Agregar logging
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
setupSwagger(app)
// Rutas
app.use('/api', mainRouter);

export default app;