import React, { useRef, useEffect, useState } from 'react';
import './ComentarioFlotante.css'; // Creamos el estilo después

const ComentarioFlotante = ({ onClose }) => {
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const offset = useRef({ x: 0, y: 0 });

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
          <textarea name="text-comen" />
        </div>
        <div className="imagen-coment">
          <h5>Imagen</h5>
          <input type="text" />
        </div>
        <button>Post</button>
      </div>
    </div>
  );
};

export default ComentarioFlotante;
