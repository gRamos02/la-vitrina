// components/Navbar.tsx
import { Button } from "@/components/ui/button"
import { Menu, Search, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function Navbar() {
  const [categories] = useState(["Anime", "Cómics", "Videojuegos", "Películas"]) // temporal

  return (
    <header className="w-full border-b shadow-sm sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight text-purple-700">La Vitrina</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {categories.map((cat) => (
            <Button key={cat} variant="ghost" className="text-sm font-medium">
              {cat}
            </Button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Search className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <User className="w-5 h-5" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                {categories.map((cat) => (
                  <Button key={cat} variant="ghost" className="justify-start">
                    {cat}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
