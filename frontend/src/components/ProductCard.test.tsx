import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from './ProductCard';
import { BrowserRouter } from 'react-router-dom';

const mockProduct = {
  _id: '1',
  name: 'Producto de Prueba',
  price: 99.99,
  description: 'Descripción de prueba',
  image: 'test-image.jpg',
  stock: 10
};

// Wrapper para proporcionar el router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  it('debería mostrar la información básica del producto', () => {
    renderWithRouter(
      <ProductCard 
        id={''} category={''} {...mockProduct}      />
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it('debería mostrar el precio con descuento cuando se proporciona', () => {
    renderWithRouter(
      <ProductCard 
        id={''} category={''} {...mockProduct}
        originalPrice={149.99}      />
    );

    expect(screen.getByText('$149.99')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('debería mostrar badges cuando el producto es nuevo o destacado', () => {
    renderWithRouter(
      <ProductCard 
        id={''} category={''} {...mockProduct}
        isNew={true}
        isHot={true}      />
    );

    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('🔥 Popular')).toBeInTheDocument();
  });

  it('debería llamar a onFavoriteClick cuando se hace clic en el botón de favorito', () => {
    const mockOnFavoriteClick = jest.fn();

    renderWithRouter(
      <ProductCard 
        id={''} category={''} {...mockProduct}
        isFavorite={false}
        onFavoriteClick={mockOnFavoriteClick}      />
    );

    fireEvent.click(screen.getByRole('button', { name: /favorito/i }));
    expect(mockOnFavoriteClick).toHaveBeenCalledWith(mockProduct._id);
  });

  it('debería llamar a onAddToCart cuando se hace clic en el botón de carrito', () => {
    const mockOnAddToCart = jest.fn();

    renderWithRouter(
      <ProductCard 
        id={''} category={''} {...mockProduct}
        onAddToCart={mockOnAddToCart}      />
    );

    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct._id);
  });
});