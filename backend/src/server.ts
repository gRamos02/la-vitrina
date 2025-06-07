import express from 'express';
import cors from 'cors';
import mainRouter from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', mainRouter);

export default app;