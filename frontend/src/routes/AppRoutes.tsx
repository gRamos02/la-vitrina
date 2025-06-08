import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopLayout } from '../layouts/ShopLayout';
import HomePage from '../pages/HomePage';
import SecondPage from '../pages/SecondPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas con Navbar */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/second" element={<SecondPage />} />
        </Route>

        {/* Rutas de administración sin Navbar */}
        {/* <Route path="/admin">
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
