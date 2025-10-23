import React, { useRef, useEffect, useState } from 'react';
import './PostFlotante.css';

const PostFlotante = ({ onClose }) => {
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

  const handlePost = () => {
    alert("¡Post enviado!"); // Aquí puedes conectar con tu lógica real
  };

  return (
    <div
      className="post-flotante"
      ref={modalRef}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <div className="post-header" onMouseDown={handleMouseDown}>
        <h5>[Crear Post]</h5>
        <button className="btn-x-post" onClick={onClose}>
          <i className="bi bi-x-circle"></i>
        </button>
      </div>
      <div className="post-body">
        <div className="text-post">
          <h5>Texto</h5>
        </div>
        <div className="post-area">
          <textarea placeholder="Escribe tu post..." />
        </div>
        <div className="imagen-post">
          <h5>Imagen</h5>
          <input type="text" placeholder="URL de la imagen" />
        </div>
        <button onClick={handlePost}>Post</button>
      </div>
    </div>
  );
};

export default PostFlotante;
