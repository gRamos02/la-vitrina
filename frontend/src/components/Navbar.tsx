// components/Navbar.tsx
import { Button } from "@/components/ui/button"
import { Menu, Search, User, ShoppingCart, Phone, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const [categories] = useState(["Anime", "Cómics", "Videojuegos", "Películas"]) // temporal
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Aquí implementarías la lógica de búsqueda
      console.log("Buscando:", searchQuery)
    }
  }, [searchQuery])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <header className="w-full border-b border-gray-200 shadow-lg sticky top-0 bg-white z-50">
      {/* Contact Bar */}
      <div className="bg-[#FF3C3B] text-[#F5F5F5] py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-end gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>WhatsApp: +52 871 123 4567</span>
          </div>
          <div className="hidden sm:block">|</div>
          <div className="hidden sm:block">
            Envíos gratis desde $500 MXN
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FF3C3B] to-[#FF8C42] bg-clip-text text-transparent">
            ¡La Vitrina!
          </div>
          <div className="hidden sm:block text-xs text-[#666] font-medium">
            Coleccionables y más...
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative w-full group">
            <div className={`relative flex items-center transition-all duration-200 ${
              isSearchFocused ? 'ring-2 ring-[#38B6FF]' : ''
            } rounded-lg overflow-hidden bg-gray-50 border border-gray-300`}>
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Buscar figuras, manga, cartas..."
                className="flex-1 bg-transparent border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 py-2.5"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-[#FF3C3B] hover:bg-[#FF8C42] text-white border-0 rounded-none px-4 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            </div>
            
            {/* Search suggestions - placeholder */}
            {searchQuery && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-2 z-50">
                <div className="text-gray-600 text-sm p-2">
                  Buscar "{searchQuery}" en todas las categorías
                </div>
              </div>
            )}
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {/* Search Icon - Mobile */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="md:hidden text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* User Account */}
          <Button 
            size="icon" 
            variant="ghost"
            className="text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="sr-only">Mi cuenta</span>
          </Button>

          {/* Shopping Cart */}
          <Button 
            size="icon" 
            variant="ghost"
            className="relative text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {/* Cart badge */}
            <span className="absolute -top-1 -right-1 bg-[#FF3C3B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              3
            </span>
            <span className="sr-only">Carrito de compras</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="md:hidden text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white border-r border-gray-200 text-gray-900 w-80">
              <div className="flex flex-col gap-6 mt-8">
                {/* Logo in mobile menu */}
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold bg-gradient-to-r from-[#FF3C3B] to-[#FF8C42] bg-clip-text text-transparent">
                    La Vitrina
                  </div>
                  <SheetClose asChild>
                    <Button size="icon" variant="ghost" className="text-gray-700 hover:text-[#FF3C3B]">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                    <Input
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Buscar productos..."
                      className="flex-1 bg-transparent border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-0"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-[#FF3C3B] hover:bg-[#FF8C42] text-white border-0 rounded-none"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </form>

                {/* Categories */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#38B6FF] font-semibold text-sm uppercase tracking-wide">
                    Categorías
                  </h3>
                  {categories.map((cat) => (
                    <SheetClose asChild key={cat}>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100 transition-colors"
                      >
                        {cat}
                      </Button>
                    </SheetClose>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Cuenta
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-700 hover:text-[#38B6FF] hover:bg-gray-100"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrito (3)
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="mt-auto pt-4 border-t border-gray-200 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+52 871 123 4567</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}