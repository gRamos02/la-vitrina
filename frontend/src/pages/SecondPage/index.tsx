import React from 'react';
import { useAtom } from 'jotai';
import { categoriesAtom } from '../../atoms';
import './styles.css';
import type { Category } from '@/vite-env';

const SecondPage: React.FC = () => {
  const [categories] = useAtom(categoriesAtom);

  return (
    <div className="second-page">
      <h1>Estado de Categorías</h1>
      
      <div className="categories-debug">
        <h2>Categorías Cargadas ({categories.length})</h2>
        
        <pre>
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>

      <div className="categories-list">
        <h2>Lista de Categorías</h2>
        {categories.length === 0 ? (
          <p>No hay categorías cargadas</p>
        ) : (
          <ul>
            {(categories as Category[]).map((category) => (
              <li key={category.id}>
                <strong>{category.name}</strong>
                {category.parentId && (
                  <span className="parent-info">
                    (ID Padre: {category.parentId})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SecondPage;