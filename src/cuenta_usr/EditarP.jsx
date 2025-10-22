import React, { useState } from 'react';
import './Perfil.css';
import ComentarioFlotante from './ventanas/ComentarioFlotante';

import usersData from '../data/userData';
import menuItems from '../data/menuItems';
import postsData from '../data/postData';
import perfilData from '../data/perfilData'; 

const Perfil = () => {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);

  const toggleComentario = (postId) => {
    setComentarioVisibleId(prev => (prev === postId ? null : postId));
  };
  
  const toggleLeft = () => {
    setIsLeftOpen((prev) => {
      if (!prev) setIsRightOpen(false);
      return !prev;
    });
  };

  const toggleRight = () => {
    setIsRightOpen((prev) => {
      if (!prev) setIsLeftOpen(false);
      return !prev;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="perfil-content-grid">
      {/* ASIDE IZQUIERDO */}
      <aside className={`perfil-aside-izq ${isLeftOpen ? 'open' : 'closed'}`}>
        <div className="perfil-contenedor">
          <div className="perfil-boton-container">
            <button className="perfil-fle-izq" onClick={toggleLeft}>
              <img
                src={isLeftOpen ? "/flecha-izq.svg" : "/flecha-der.svg"}
                alt="Toggle menú izquierdo"
                className="perfil-fle-ico"
              />
            </button>
          </div>

          {isLeftOpen && (
            <div className="perfil-cont-izq">
              <h3>Siguiendo</h3>
              <div className="perfil-izq-perf">
                <div className="perfil-izq-arti">
                  <ul className="perfil-menu-perf">
                    {usersData.map(user => (
                      <li key={user.id}>
                        <img src={user.avatar} alt={`Avatar de ${user.name}`} />
                        <a href="#">{user.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* HEADER */}
      <header className="perfil-head-base">
        <h1><a href="/">MySpace</a></h1>
        <p>Perfil</p>
      </header>

      {/* MAIN - SE MANTIENE INTACTO */}
      <main className="perfil-main-base">


          
        

        <footer className="perfil-main-foot">
          <p>
            <a href="https://validator.w3.org/#validate_by_input" target="_blank" rel="noreferrer">
              <img style={{ border: 0, width: '88px', height: '31px' }} src="/w3c-html.png" alt="Valid HTML!" />
            </a>
          </p>
          <p>
            <a href="https://jigsaw.w3.org/css-validator/#validate_by_input" target="_blank" rel="noreferrer">
              <img style={{ border: 0, width: '88px', height: '31px' }} src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS!" />
            </a>
          </p>
        </footer>
      </main>

      {/* ASIDE DERECHO */}
      <aside className={`perfil-aside-der ${isRightOpen ? 'open' : 'closed'}`}>
        <button className="perfil-fle-der" onClick={toggleRight}>
          <img
            src={isRightOpen ? "/flecha-der.svg" : "/flecha-izq.svg"}
            alt="Toggle menú derecho"
            className="perfil-fle-ico"
          />
        </button>

        {isRightOpen && (
          <>
            <article className="perfil-cont-der">
              <h3>Tablones</h3>
              <input
                type="text"
                placeholder="Buscar tablón..."
                name="buscar"
                className="perfil-input-buscar"
              />
              <ul className="perfil-list-der">
                {menuItems.map(item => (
                  <li key={item.id}><a href={item.link}>{item.label}</a></li>
                ))}
              </ul>
            </article>
          </>
        )}
      </aside>

      {/* FOOTER BASE */}
      <footer className="perfil-foot-base">
        <ul>
          <li><a href="#">Acerca de</a> |</li>
          <li><a href="#">Reglas</a> |</li>
          <li><a href="#">Términos y condiciones</a> |</li>
          <li><a href="#">Privacidad</a> |</li>
          <li><a href="#">Contacto</a> |</li>
        </ul>
        <p>&copy;2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Perfil;
