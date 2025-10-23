// src/cuenta_usr/EditarP.jsx
import React, { useState } from 'react';
import './EditarP.css';
import ComentarioFlotante from './ventanas/ComentarioFlotante';

import usersData from '../data/userData';
import menuItems from '../data/menuItems';
import postsData from '../data/postData';

const Edit = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);

  const toggleComentario = (postId) => {
    setComentarioVisibleId(prev => (prev === postId ? null : postId));
  };
  
  const toggleLeft = () => {
    setIsLeftOpen(prev => {
      if (!prev) setIsRightOpen(false);
      return !prev;
    });
  };

  const toggleRight = () => {
    setIsRightOpen(prev => {
      if (!prev) setIsLeftOpen(false);
      return !prev;
    });
  };

  return (
    <div className={`edit-content-grid ${isLeftOpen && isRightOpen ? "both-open" : isLeftOpen ? "one-open-left" : isRightOpen ? "one-open-right" : "none-open"}`}>

      {/* ASIDE IZQUIERDO */}
      <aside className={`edit-aside-izq ${isLeftOpen ? 'open' : 'closed'}`}>
        <div className="edit-contenedor">
          <div className="edit-boton-container">
            <button className="edit-fle-izq" onClick={toggleLeft}>
              <img
                src={isLeftOpen ? "/flecha-izq.svg" : "/flecha-der.svg"}
                alt="Toggle menú izquierdo"
                className="edit-fle-ico"
              />
            </button>
          </div>

          {isLeftOpen && (
            <div className="edit-cont-izq">
              <h3>Siguiendo</h3>
              <ul className="edit-menu-perf">
                {usersData.map(user => (
                  <li key={user.id}>
                    <img src={user.avatar} alt={`Avatar de ${user.name}`} />
                    <a href="#">{user.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* HEADER */}
      <header className="edit-head-base" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <h1><a href="/">MySpace</a></h1>
        <p>Editar Perfil</p>
      </header>

      {/* MAIN */}
      <main className="edit-main-base">
        <div className="edit-main-content">

          {/* PERFIL */}
          <div className="edit-cont-perfil">
            <div className="edit-ima-perf">
              <img src={usuario?.avatar || '/default-avatar.png'} alt="Foto de perfil" />
              <button className="edit"><i className="bi bi-pencil-square"></i></button>
            </div>

            <div className="edit-descrip-perf">
              <div className="edit-nom">
                <h2>{usuario?.nombre} {usuario?.apaterno}</h2>
                <button className="edit"><i className="bi bi-pencil-square"></i></button>
              </div>

              <div className="edit-desc">
                <p>¡Bienvenido a tu perfil! Aquí puedes editar tu información y tus preferencias.</p>
                <div className="edit-desc-buttons">
                  <button className="edit"><i className="bi bi-pencil-square"></i></button>
                  <button className="delet"><i className="bi bi-trash3"></i></button>
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* CONFIGURACIÓN DE PÁGINA */}
          <div className="edit-page">
            <h5>Página</h5>
            <div className="edit-color-page">
              <label>Color de página:</label>
              <div>
                <button>Editar</button>
                <button>Borrar</button>
              </div>
            </div>
            <div className="edit-color-fondo">
              <label>Color de fondo:</label>
              <div>
                <button>Editar</button>
                <button>Borrar</button>
              </div>
            </div>
            <div className="edit-image-fondo">
              <label>Imagen de fondo:</label>
              <div>
                <button>Editar</button>
                <button>Borrar</button>
              </div>
            </div>
            <div className="edit-tipo-font">
              <label>Tipo de letra:</label>
              <div>
                <button>Editar</button>
                <button>Borrar</button>
              </div>
            </div>
            <div className="edit-tam">
              <label>Tamaño de letra:</label>
              <input type="range" id="tam-font" name="tam-font" min="0" max="40" defaultValue="13"/>
            </div>
          </div>

          <hr />

          {/* POSTS / COMENTARIOS */}
          <div className="edit-com-post">
            <h5>Post / Comentario</h5>
            <div className="content-edit">
              {postsData.map(post => (
                <div key={post.id} className="blog-post">
                  <div className="post-perf">
                    <div className="info-main">
                      <img className="ima-inf" src={post.avatar} alt={`avatar de ${post.author}`} />
                      <h6 className="nombre">{post.author}</h6>
                      <h6 className="public">Publicó</h6>
                      <h6 className="fecha">{post.date}</h6>
                    </div>
                    <div className="post"><p>{post.content}</p></div>
                    {post.image && <div className="post-ima"><img className="ima-pub" src={post.image} alt="imagen del post" /></div>}
                    <div className="opciones-botton">
                      <a className="check" href="#">[check]</a>
                      <button className="kudos"><i className="bi bi-bug-fill"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER MAIN */}
        <footer className="edit-main-foot">
          <p>
            <a href="https://validator.w3.org/#validate_by_input" target="_blank" rel="noreferrer">
              <img style={{border:0,width:'88px',height:'31px'}} src="/w3c-html.png" alt="Valid HTML!" />
            </a>
          </p>
          <p>
            <a href="https://jigsaw.w3.org/css-validator/#validate_by_input" target="_blank" rel="noreferrer">
              <img style={{border:0,width:'88px',height:'31px'}} src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS!" />
            </a>
          </p>
        </footer>
      </main>

      {/* ASIDE DERECHO */}
      <aside className={`edit-aside-der ${isRightOpen ? 'open' : 'closed'}`}>
        <button className="edit-fle-der" onClick={toggleRight}>
          <img src={isRightOpen ? "/flecha-der.svg" : "/flecha-izq.svg"} alt="Toggle menú derecho" className="edit-fle-ico" />
        </button>
        {isRightOpen && (
          <article className="edit-cont-der">
            <h3>Tablones</h3>
            <input type="text" placeholder="Buscar tablón..." name="buscar" className="edit-input-buscar"/>
            <ul className="edit-list-der">
              {menuItems.map(item => <li key={item.id}><a href={item.link}>{item.label}</a></li>)}
            </ul>
          </article>
        )}
      </aside>

      {/* FOOTER BASE */}
      <footer className="edit-foot-base">
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

export default Edit;
