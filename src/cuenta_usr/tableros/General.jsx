import React, { useState } from 'react';
import './General.css'; // Si tienes un nuevo CSS para general, cámbialo aquí
import ComentarioFlotante from '../ventanas/ComentarioFlotante';
import PostFlotante from '../ventanas/PostFlotante';

import usersData from '../../data/userData';
import menuItems from '../../data/menuItems';
import postsData from '../../data/postData';

const General = () => {
  const [kudosCounts, setKudosCounts] = useState( postsData.reduce((acc, post) => { acc[post.id] = post.kudos || 0; return acc; }, {}) );
  const [clickedKudos, setClickedKudos] = useState(null);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);
  const [showPostFlotante, setShowPostFlotante] = useState(false);

  const handleKudosClick = (postId) => { 
    setKudosCounts(prev => ({ 
      ...prev, 
      [postId]: prev[postId] + 1, 
    }));
    setClickedKudos(postId);
    setTimeout(() => setClickedKudos(null), 300); };

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
    <div
      className={`general-content-grid ${
        isLeftOpen && isRightOpen
          ? "both-open"
          : isLeftOpen
          ? "one-open-left"
          : isRightOpen
          ? "one-open-right"
          : "none-open"
      }`}
    >
      {/* ASIDE IZQUIERDO */}
      <aside className={`general-aside-izq ${isLeftOpen ? 'open' : 'closed'}`}>
        <div className="general-contenedor">
          <div className="general-boton-container">
            <button className="general-fle-izq" onClick={toggleLeft}>
              <img
                src={isLeftOpen ? "/flecha-izq.svg" : "/flecha-der.svg"}
                alt="Toggle menú izquierdo"
                className="general-fle-ico"
              />
            </button>
          </div>

          {isLeftOpen && (
            <div className="general-cont-izq">
              <h3>Siguiendo</h3>
              <div className="general-izq-perf">
                <div className="general-izq-arti">
                  <ul className="general-menu-perf">
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
      <header className="general-head-base">
        <h1><a href="/">MySpace</a></h1>
        <p>General</p>
      </header>

      {/* MAIN */}
      <main className="general-main-base">

        <div className="general-main-blog">
          <hr />
          <div className="general-blog-area">
            <div className="general-main-navbar">
              <div className="general-navbar-left">
                <ul className="general-navbar-ul">
                  <li>
                    <button onClick={() => setShowPostFlotante(true)}>[Crear Post]</button>
                  </li>
                  <li><button>[Buscar]</button></li>
                  <li><button>[Hashtags]</button></li>
                </ul>
               {showPostFlotante && (
                  <PostFlotante onClose={() => setShowPostFlotante(false)} />
               )}
              </div>
            </div>

            <div className="general-all-post">
              {postsData.map((post) => (
                <div className="general-blog-post" key={post.id}>
                  <div className="general-post-perf">
                    <div className="general-info-main">
                      <img className="general-ima-inf" src={post.avatar} alt="foto perfil" />
                      <h6 className="general-nombre">{post.author}</h6>
                      <h6 className="general-public">Publicó</h6>
                      <h6 className="general-fecha">{post.date}</h6>
                      <div className="general-opciones-botton">
                        <button
                          className="general-crear-coment"
                          onClick={() => toggleComentario(post.id)}
                        >
                          <i className="bi bi-caret-right-fill"></i>
                        </button>

                        {comentarioVisibleId === post.id && (
                          <ComentarioFlotante onClose={() => setComentarioVisibleId(null)} />
                        )}
                      </div>
                    </div>
                    <div className="general-post">
                      <p>{post.content}</p>
                    </div>
                    {post.image && (
                      <div className="general-post-ima">
                        <img className="general-ima-pub" src={post.image} alt="imagen-post" />
                      </div>
                    )}

                    <div className="general-opciones-botton">
                      <a className="general-check" href="#">[check]</a>
                      <button
                        className={`general-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudosClick(post.id)}
                        title={`${kudosCounts[post.id]} kudos`}
                      >
                        <i className="bi bi-bug-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="general-main-foot">
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
      <aside className={`general-aside-der ${isRightOpen ? 'open' : 'closed'}`}>
        <button className="general-fle-der" onClick={toggleRight}>
          <img
            src={isRightOpen ? "/flecha-der.svg" : "/flecha-izq.svg"}
            alt="Toggle menú derecho"
            className="general-fle-ico"
          />
        </button>

        <div id="ima-perfil">
          <img
            id="btn-perfil"
            src="myspace.svg"
            alt="Foto de perfil"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div id="cont-dropdown">
              <ul>
                <li>
                  <a href="Cuenta">Iniciar Sesión / Registrarse</a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {isRightOpen && (
          <article className="general-cont-der">
            <h3>Tablones</h3>
            <input
              type="text"
              placeholder="Buscar tablón..."
              name="buscar"
              className="general-input-buscar"
            />
            <ul className="general-list-der">
              {menuItems.map(item => (
                <li key={item.id}><a href={item.link}>{item.label}</a></li>
              ))}
            </ul>
          </article>
        )}
      </aside>

      {/* FOOTER BASE */}
      <footer className="general-foot-base">
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

export default General;
