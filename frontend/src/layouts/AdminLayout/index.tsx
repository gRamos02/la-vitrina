import { Link, Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  LayoutGrid,
  ShoppingBag,
  Users,
  LayoutDashboard,
  Menu,
} from "lucide-react"
import { useState } from 'react'

const AdminLayout = () => {
  const [open, setOpen] = useState(false)

  const NavigationContent = () => (
    <nav className="space-y-1 p-4">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link to="/admin">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link to="/admin/categories">
          <LayoutGrid className="h-5 w-5" />
          Categorías
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link to="/admin/products">
          <ShoppingBag className="h-5 w-5" />
          Productos
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link to="/admin/users">
          <Users className="h-5 w-5" />
          Usuarios
        </Link>
      </Button>
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-background border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <NavigationContent />
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <header className="h-16 border-b flex items-center px-6">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="h-16 flex items-center px-6 border-b">
                  <h2 className="text-lg font-semibold">Admin Panel</h2>
                </div>
                <NavigationContent />
              </SheetContent>
            </Sheet>
          </div>
          {/* <h1 className="text-xl font-semibold ml-4 md:ml-0">Panel Administrativo</h1> */}
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout