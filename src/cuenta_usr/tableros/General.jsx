import React, { useState, useEffect } from 'react';
import './General.css'; // Si tienes un nuevo CSS para general, cámbialo aquí
import '../../home_prin/Home.css';
import ComentarioFlotante from '../ventanas/ComentarioFlotante';
import PostFlotante from '../ventanas/PostFlotante';
import { Link } from 'react-router-dom';

import usersData from '../../data/userData';
import menuItems from '../../data/menuItems';
import postsData from '../../data/postData';
import perfilData from '../../data/perfilData';

const General = () => {

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : postsData;
  });

  const [kudosCounts, setKudosCounts] = useState(() => {
    // Inicializa kudos según posts cargados
    return posts.reduce((acc, post) => {
      acc[post.id] = post.kudos || 0;
      return acc;
    }, {});
  });

  const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado")) || null; // Solo se lee el usuario logeado

  const [clickedKudos, setClickedKudos] = useState(null);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);
  const [showPostFlotante, setShowPostFlotante] = useState(false);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // Maneja click en kudos
  const handleKudosClick = (postId) => {
    setKudosCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    setClickedKudos(postId);
    setTimeout(() => setClickedKudos(null), 300);
  };

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

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleAddPost = (nuevoPost) => {
    // Generar ID único basado en timestamp o max id + 1
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    const newPost = {
      id: newId,
      author: perfilData.nombre,
      avatar: perfilData.imagen,
      date: new Date().toLocaleString(),
      content: nuevoPost.content,
      image: nuevoPost.image || null,
      comments: [],
      kudos: 0,
    };

    setPosts([newPost, ...posts]);
    setShowPostFlotante(false);

    // Actualiza kudosCounts con el nuevo post
    setKudosCounts(prev => ({ ...prev, [newId]: 0 }));
  };

  const handleAddComentario = (postId, nuevoComentario) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...(post.comments || []),
                {
                  id: Date.now(),
                  author: perfilData.nombre,
                  avatar: perfilData.imagen,
                  text: nuevoComentario,
                },
              ],
            }
          : post
      )
    );
    setComentarioVisibleId(null);
  };

  return (
    <div className="general-content-grid">
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
                  <PostFlotante
                    onClose={() => setShowPostFlotante(false)}
                    onAddPost={handleAddPost}
                  />
                )}
              </div>
            </div>

            <div className="general-all-post">
              {posts.map((post) => (
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
                          <ComentarioFlotante
                            onClose={() => setComentarioVisibleId(null)}
                            onSubmit={(texto) => handleAddComentario(post.id, texto)}
                          />
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
                      {/* Cambiar estos links con propósito real si tienes */}
                      <button className="general-check" type="button">[check]</button>
                      <button
                        className={`general-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudosClick(post.id)}
                        title={`${kudosCounts[post.id] || 0} kudos`}
                      >
                        <i className="bi bi-bug-fill"></i>
                      </button>
                    </div>

                    {/* Mostrar comentarios */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="general-comentarios">
                        {post.comments.map(c => (
                          <div key={c.id} className="comentario-item">
                            <img src={c.avatar} alt="avatar" />
                            <strong>{c.author}</strong>
                            <p>{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="general-main-foot">
          <p>
            <a
              href="https://validator.w3.org/#validate_by_input"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{ border: 0, width: '88px', height: '31px' }}
                src="/w3c-html.png"
                alt="Valid HTML!"
              />
            </a>
          </p>
          <p>
            <a
              href="https://jigsaw.w3.org/css-validator/#validate_by_input"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{ border: 0, width: '88px', height: '31px' }}
                src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
                alt="Valid CSS!"
              />
            </a>
          </p>
        </footer>
        
      </main>

      {/* ASIDE DERECHO */}
      <aside id="aside-der" className={isRightOpen ? "open" : "closed"}>
        <button id="fle-der" onClick={toggleRight}>
          <img
            src={isRightOpen ? "/flecha-der.svg" : "/flecha-izq.svg"}
            alt="Toggle menú derecho"
            className="fle-ico"
          />
        </button>

        {isRightOpen && (
          <>
            <div id="ima-perfil">
              <img
                id="btn-perfil"
                src="myspace.svg"
                alt="Foto de perfil"
                onClick={toggleDropdown}
                //style={{ cursor: 'pointer' }}
              />
 
              {isDropdownOpen && (
                <div id="cont-dropdown">
                  <ul>
                    <li>
                      <a href="/perfil">Mi Perfil</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <article id="cont-der">
              <h3>Tablones</h3>
              <input
                type="text"
                id="busqueda-tablon"
                placeholder="Buscar tablón..."
                //name="buscar"
                //className="general-input-buscar"
              />
              <ul id="ist-der">
            {menuItems.slice(1).map((item, index) => (
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
      <footer className="general-foot-base">
        <ul>
          <li><a href="#">Acerca de</a> |</li>
          <li><a href="#">Reglas</a> |</li>
          <li><a href="#">Términos y condiciones</a> |</li>
          <li><a href="#">Privacidad</a> |</li>
          <li><a href="#">Contacto</a></li>
        </ul>
        <p>&copy;2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default General;
