import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopLayout } from '../layouts/ShopLayout';
import HomePage from '../pages/HomePage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import RequireAuth from '@/components/RequireAuth';
import AdminRedirect from '@/components/AdminRedirect';
import { Toaster } from 'sonner';
import AdminCategoriesPage from '@/pages/admin/AdminCategory';
import AdminProductList from '@/pages/admin/Products/AdminProductList';
import AdminProductForm from '@/pages/admin/Products/AdminProductForm';
import AdminProductEditForm from '@/pages/admin/Products/AdminProductEditForm';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas con Navbar */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Rutas de administración sin Navbar */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<RequireAuth />}>
          <Route index element={<AdminRedirect />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id" element={<AdminProductEditForm />} />

        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
