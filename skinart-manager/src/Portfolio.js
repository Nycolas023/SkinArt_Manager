import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './Portfolio.css';

function Portfolio() {
  const [images, setImages] = useState([]);

  // Bloqueia scroll da página externa quando componente monta
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages(prev => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const deleteImage = (index) => {
    if (window.confirm('Tem certeza que deseja remover esta tatuagem do portfólio?')) {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="portfolio-overlay">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h2>Portfólio de Tatuagens</h2>
        </div>
        
        <div className="portfolio-scroll-area">
          {images.length === 0 ? (
            <div className="empty-message">
              <p>Nenhum trabalho adicionado ainda</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img src={image} alt={`Tatuagem ${index + 1}`} />
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(index);
                    }}
                    aria-label="Remover imagem"
                  >
                    <FaTimes className="delete-icon" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="portfolio-footer">
          <label className="upload-btn">
            {images.length === 0 ? 'Adicionar Trabalhos' : 'Adicionar Mais Trabalhos'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;