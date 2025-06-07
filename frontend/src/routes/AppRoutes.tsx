import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SecondPage from '../pages/SecondPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/second" element={ <SecondPage />} />
        {/* aquí más rutas */}
      </Routes>
    </BrowserRouter>
  );
}
