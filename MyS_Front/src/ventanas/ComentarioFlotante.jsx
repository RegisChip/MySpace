// MySpace\MyS_Front\src\ventanas\ComentarioFlotante.jsx

import React, { useRef, useEffect, useState } from 'react';
import './ComentarioFlotante.css';

const ComentarioFlotante = ({ onClose, onSubmit }) => {
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [textComent, setTextComent] = useState('');
  const [imageComent, setImageComent] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    const rect = modalRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  };

  const handleSubmit = () => {
    if (!textComent.trim()) {
      alert('El texto del comentario no puede estar vacío.');
      return;
    }

    onSubmit(textComent);
  };

  return (
    <div
      className="comentario-flotante"
      ref={modalRef}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <div className="comentario-header" onMouseDown={handleMouseDown}>
        <h5>[Crear Comentario]</h5>
        <button className="btn-x-coment" onClick={onClose}>
          <i className="bi bi-x-circle"></i>
        </button>
      </div>

      <div className="comentario-body">
        <div className="text-coment">
          <h5>Texto</h5>
        </div>
        <div className="coment-area">
          <textarea
            name="text-coment"
            value={textComent}
            onChange={(e) => setTextComent(e.target.value)}
            placeholder="Escribe tu comentario aquí"
          />
        </div>

        <div className="imagen-coment">
          <h5>Imagen</h5>
          <input
            type="text"
            value={imageComent}
            onChange={(e) => setImageComent(e.target.value)}
            placeholder="URL de la imagen"
          />
        </div>

        <button onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
};

export default ComentarioFlotante;