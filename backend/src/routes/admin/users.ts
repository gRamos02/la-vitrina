//Rutas para iniciar sesion o crear admins
import { Router } from 'express';
// Make sure the following file exists: ../../controllers/admin/user.ts
// If the file is missing, create it and export createAdmin and loginAdmin functions:
import { createAdmin, loginAdmin } from '../../controllers/admin/user';
import { verifyAdmin } from '../../middlewares/auth';

const router = Router();
// Ruta para crear un nuevo administrador
router.post('/create', verifyAdmin, createAdmin);
// Ruta para iniciar sesión como administrador
router.post('/auth/login', loginAdmin);

export default router;