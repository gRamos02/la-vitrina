import React from 'react';
import './styles.css';

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <h1 className="title">Bienvenidos a La Vitrina</h1>
      <p className="description">
        Tu destino para encontrar los mejores productos. Explora nuestra amplia selección
        de artículos cuidadosamente seleccionados para ti.
      </p>
    </div>
  );
};

export default HomePage;
