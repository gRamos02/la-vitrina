import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const JWT_SECRET = process.env.JWT_SECRET; // Usa env en producción
  const token = req.headers.authorization?.split(" ")[1]; // Formato "Bearer <token>"

  if (!token) {
    res.status(401).json({ success: false, error: "No token provided" });
    return;
  }
  console.log(JWT_SECRET);

  if (!JWT_SECRET) {
    res
      .status(500)
      .json({ success: false, error: "JWT secret not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.user = decoded;

    if (
      !decoded ||
      typeof decoded !== "object" ||
      (decoded as any).role !== "admin"
    ) {
      res.status(403).json({ success: false, error: "Access denied" });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid token" });
    return;
  }
};
