import Navbar from '@/components/Navbar'
import SecondaryNav from '@/components/SecondaryNav'
import { Outlet } from 'react-router-dom'

export function ShopLayout() {
  return (
    <>
      <Navbar />
      <SecondaryNav />
      <main>
        <Outlet />
      </main>
    </>
  )
}
