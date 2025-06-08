import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mainRouter from './routes';

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

// Rutas
app.use('/api', mainRouter);

export default app;