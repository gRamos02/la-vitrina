import React from 'react';
import './styles.css';
import { useAtom } from 'jotai';
import { categoriesAtom } from '../../atoms';
import { fetchCategories } from '../../api/categories';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const newCategories = await fetchCategories();
      setCategories(newCategories);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Bienvenidos a La Vitrina</h1>
        <p className="description">
          Tu destino para encontrar los mejores productos. Explora nuestra amplia selección
          de artículos cuidadosamente seleccionados para ti.
        </p>
        
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="refresh-button"
        >
          {isLoading ? 'Cargando...' : '🔄 Refrescar Categorías'}
        </button>

        <Link to="/second">
          <button className="navigation-button">
            Ir a Segunda Página
          </button>
        </Link>
      </div>

      <ul>
        {categories.map((cat: any) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </>
  );
};

export default HomePage;
