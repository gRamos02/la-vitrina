import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

export function ShopLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}