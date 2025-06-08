import AdminLayout from '@/layouts/AdminLayout';
import { Navigate } from 'react-router-dom';

export default function RequireAuth() {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si hay token, renderiza la ruta protegida
  return <AdminLayout />;
}
