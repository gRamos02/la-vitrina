import { Navigate } from 'react-router-dom';

export default function AdminRedirect() {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/login" replace />;
}
