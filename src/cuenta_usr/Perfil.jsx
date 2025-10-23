import React, { useState } from 'react';
import './Perfil.css';
import ComentarioFlotante from './ventanas/ComentarioFlotante';

import usersData from '../data/userData';
import menuItems from '../data/menuItems';
import postsData from '../data/postData';
import perfilData from '../data/perfilData'; 

import { useNavigate } from "react-router-dom";


const Perfil = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  const navigate = useNavigate();
  const [kudosCounts, setKudosCounts] = useState(
    postsData.reduce((acc, post) => {
      acc[post.id] = post.kudos || 0; // si post.kudos existe, lo usa; sino 0
      return acc;
    }, {})
  );
  const [clickedKudos, setClickedKudos] = useState(null);
  const [clickedEdit, setClickedEdit] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);

    const handleLogout = () => {
    localStorage.removeItem("user"); // elimina usuario logueado
    navigate("/cuenta"); // redirige a login
  };

  const handleKudosClick = (postId) => {
    setKudosCounts(prev => ({
      ...prev,
      [postId]: prev[postId] + 1,
    }));
    setClickedKudos(postId);
    // Quitar animación después de 300ms
    setTimeout(() => setClickedKudos(null), 300);
  };

  // Funciones para manejar click
  const handleEditClick = () => {
    setClickedEdit(true);
    setTimeout(() => setClickedEdit(false), 300); // quita efecto después de 300ms
  };

  const handleDeleteClick = () => {
    setClickedDelete(true);
    setTimeout(() => setClickedDelete(false), 300);
  };

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
      className={`perfil-content-grid ${
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

      <header className="perfil-head-base" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1><a href="/">MySpace</a></h1>
          <p>Perfil</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "5px 10px",
            backgroundColor: "#6b8ebf",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            borderRadius: "4px"
          }}
        >
          Cerrar sesión
        </button>
      </header>

      {/* MAIN - SE MANTIENE INTACTO */}
      <main className="perfil-main-base">
        <div className="perfil-main-content">
          <div className="perfil-main-ima-perf">
            <img src={perfilData.imagen} alt="Imagen de perfil" />
          </div>
          <div className="perfil-descrip-perf">
            <h2>{usuario?.nombre} {usuario?.apaterno}</h2>
            <p>¡Bienvenido a tu perfil!</p>
          </div>
        </div>
        <div className="perfil-main-blog">
          <hr />
          <div className="perfil-blog-area">
            <div className="perfil-main-navbar">
              <div className="perfil-navbar-left">
                <ul className="perfil-navbar-ul">
                  <li><a href="#">[Hashtags]</a></li>
                  <li><a href="#">[Imágenes]</a></li>
                </ul>
              </div>

              <div className="perfil-navbar-right">
                <ul className="perfil-mod">
                  <li>
                    {/* Botón lápiz: sigue siendo link */}
                    <a
                      href="/editar"
                      className={`perfil-edit-btn ${clickedEdit ? 'clicked' : ''}`}
                      onMouseDown={() => setClickedEdit(true)}
                      onMouseUp={() => setClickedEdit(false)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </a>

                    {/* Botón basura: transparente, igual efecto que lápiz */}
                    <button
                      className={`perfil-delete-btn ${clickedDelete ? 'clicked' : ''}`}
                      onMouseDown={() => setClickedDelete(true)}
                      onMouseUp={() => setClickedDelete(false)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </li>
                </ul>
              </div>





                      
              {/*<div className="perfil-navbar-right">
                <ul className="perfil-mod">
                  <li>
                    <a href="/editar">
                      <i className="bi bi-pencil-square"></i><i className="bi bi-trash"></i>
                    </a>
                  </li>
                </ul>
              </div>*/}






            </div>


            <div className="perfil-all-post">
              {postsData.map((post) => (
                <div className="perfil-blog-post" key={post.id}>
                  <div className="perfil-post-perf">
                    <div className="perfil-info-main">
                      <img className="perfil-ima-inf" src={post.avatar} alt="foto perfil" />
                      <h6 className="perfil-nombre">{post.author}</h6>
                      <h6 className="perfil-public">Publicó</h6>
                      <h6 className="perfil-fecha">{post.date}</h6>
                      <div className="perfil-opciones-botton">
                        <button
                          className="perfil-crear-coment"
                          onClick={() => toggleComentario(post.id)}
                        >
                          <i className="bi bi-caret-right-fill"></i>
                        </button>

                        {comentarioVisibleId === post.id && (
                          <ComentarioFlotante onClose={() => setComentarioVisibleId(null)} />
                        )}
                      </div>

                    </div>
                    <div className="perfil-post">
                      <p>{post.content}</p>
                    </div>
                    {post.image && (
                      <div className="perfil-post-ima">
                        <img className="perfil-ima-pub" src={post.image} alt="imagen-post" />
                      </div>
                    )}
                    <div className="perfil-opciones-botton">
                      <a className="perfil-check" href="#">[check]</a>
                      <button
                        className={`perfil-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudosClick(post.id)}
                        title={`${kudosCounts[post.id]} kudos`} // mostrar cantidad al pasar mouse
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
