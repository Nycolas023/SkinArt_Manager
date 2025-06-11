import React from 'react';
import './Portfolio.css';

function Portfolio() {
  return (
    <div className="portfolio">
      <h2>Portfólio de Tatuagens</h2>
      <div className="gallery">
        {/* Itens do portfólio serão adicionados aqui */}
        <div className="empty-message">
          <p>Nenhum trabalho adicionado ainda</p>
          <button className="btn btn-primary">
            Adicionar Novo Trabalho
          </button>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;