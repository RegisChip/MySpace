import React, { useEffect, useState } from 'react';
import './Perfil.css';
import { useNavigate } from "react-router-dom";
import ComentarioFlotante from './ventanas/ComentarioFlotante';

import usersData from '../data/userData';
import menuItems from '../data/menuItems';
import postsData from '../data/postData';
import perfilData from '../data/perfilData'; 

const Perfil = () => {

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Estados para posts y comentarios
  const [posts, setPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  const [kudosCounts, setKudosCounts] = useState(
    postsData.reduce((acc, post) => {
      acc[post.id] = post.kudos || 0;
      return acc;
    }, {})
  );

  const [kudosCountsComentarios, setKudosCountsComentarios] = useState({});
  
  const handleComentarioKudosClick = (comentarioId, postId) => {
    setKudosCountsComentarios(prev => ({
      ...prev,
      [comentarioId]: (prev[comentarioId] || 0) + 1
    }));
    setClickedKudos(comentarioId);
    setTimeout(() => setClickedKudos(null), 300);
  };

  const [clickedKudos, setClickedKudos] = useState(null);
  const [clickedEdit, setClickedEdit] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);

  useEffect(() => {
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    if (!usuarioLogeado) {
      // redirige al inicio si no hay usuario logueado
      navigate("/");
      return;
    }

    const usuarioEncontrado = perfilData.find((u) => u.correo === usuarioLogeado.correo); // busca datos del usuario
    setUsuario(usuarioEncontrado);

    // Filtra posts del usuario
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const userPosts = savedPosts.filter(p => p.author === usuarioEncontrado.nombre);
    setPosts(userPosts);

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogeado"); // elimina usuario logueado
    navigate("/");
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

  const handleAgregarComentario = (postId, texto) => {
    const newPosts = posts.map(post => {
      if (post.id === postId) {
        const nuevoComentario = {
          id: Date.now(),
          author: usuario.nombre,
          text: texto,
          avatar: usuario.imagen,
        };
        return {
          ...post,
          comments: [...(post.comments || []), nuevoComentario]
        };
      }
      return post;
    });

    setPosts(newPosts);
    // Actualizamos el localStorage
    const savedPosts = JSON.parse(localStorage.getItem("post") || "[]");
    const updatedPostsLS = savedPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), {
            id: Date.now(),
            author: usuario.nombre,
            text: texto,
            avatar: usuario.imagen,
          }]
        };
      }
      return post;
    });
    localStorage.setItem("post", JSON.stringify(updatedPostsLS));

    setComentarioVisibleId(null);
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

  if (!usuario) return null; //espera a cargar el usuario

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
        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* MAIN */}
      <main className="perfil-main-base">
        <div className="perfil-main-content">
          <div className="perfil-main-ima-perf">
            <img src={usuario.imagen} alt="Imagen de perfil" />
          </div>
          <div className="perfil-descrip-perf">
            <h2>{usuario.nombre}</h2>
            <p>{usuario.descripcion}</p>
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
                    <a href="/editar">
                      <i className="bi bi-pencil-square"></i><i className="bi bi-trash"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="perfil-all-post">
              {posts.map((post) => (
                <div className="perfil-blog-post" key={post.id}>
                  <div className="perfil-post-perf">

                    {/* --- Info del autor --- */}
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
                          <ComentarioFlotante
                            onClose={() => setComentarioVisibleId(null)}
                            onSubmit={(texto) => handleAgregarComentario(post.id, texto)}
                          />
                        )}
                      </div>
                    </div>

                    {/* --- Contenido del post --- */}
                    <div className="perfil-post">
                      <p>{post.content}</p>
                    </div>

                    {/* --- Imagen del post si existe --- */}
                    {post.image && (
                      <div className="perfil-post-ima">
                        <img className="perfil-ima-pub" src={post.image} alt="imagen-post" />
                      </div>
                    )}

                    {/* --- Botones de interacción (check/kudos) --- */}
                    <div className="perfil-opciones-botton">
                      <button className="perfil-check" type="button">[check]</button>
                      <button
                        className={`perfil-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudosClick(post.id)}
                        title={`${kudosCounts[post.id] || 0} kudos`}
                      >
                        <i className="bi bi-bug-fill"></i>
                      </button>
                    </div>
                  </div>

                  {/* --- Comentarios --- */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="perfil-comentarios-lista">
                      {post.comments.map(c => (
                        <div key={c.id} className="perfil-comentario-item">

                          {/* Cabecera del comentario */}
                          <div className="perfil-comentario-header">
                            <img 
                              className="perfil-comentario-avatar" 
                              src={c.avatar} 
                              alt={`Avatar de ${c.author}`} 
                            />
                            <div className="perfil-comentario-info">
                              <span className="perfil-comentario-autor">{c.author}</span>
                              <span className="perfil-comentario-texto"> respondió</span>
                            </div>
                          </div>

                          {/* Contenido del comentario */}
                          <div className="perfil-comentario-contenido">
                            <p>{c.text}</p>
                          </div>

                          {/* BOTONES DE KUDOS Y CHECK PARA CADA COMENTARIO */}
                          <div className="perfil-opciones-comentario">
                            <button className="perfil-check" type="button">
                              [check]
                            </button>
                            <button
                              className={`perfil-kudos ${clickedKudos === c.id ? 'clicked' : ''}`}
                              onClick={() => handleComentarioKudosClick(c.id, post.id)}
                              title={`${kudosCountsComentarios[c.id] || 0} kudos`}
                            >
                              <i className="bi bi-bug-fill"></i>
                            </button>
                          </div>

                        </div>
                        ))}
                    </div>
                  )}
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
              {menuItems.slice(1).map((item) => (
                <li key={item.id}>
                  <a href={item.link}>{item.label}</a>
                </li>
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