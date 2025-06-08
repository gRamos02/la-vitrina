import { Request, Response } from "express";
import { ApiResponse } from "../../types/api";
import jwt from 'jsonwebtoken';
import User from "../../models/User";
import bcrypt from 'bcrypt';

// Login de administrador
export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Faltan credenciales',
        message: 'Email y contraseña son obligatorios',
      });
      return;
    }

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'Usuario o contraseña incorrectos',
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'Usuario o contraseña incorrectos',
      });
      return;
    }
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Error en el proceso de login',
    });
  }
};

// Crear nuevo administrador
export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validación simple
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'Todos los campos son obligatorios',
      });
      return;
    }

    // Verificar que el email no esté ya registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'Usuario ya existe',
        message: 'Ya existe un usuario con este email',
      });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario admin
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error('Error creando admin:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Error al crear administrador',
    });
  }
};