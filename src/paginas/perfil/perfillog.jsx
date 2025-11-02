// src/paginas/perfil/Perfil.jsx

import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ComentarioFlotante from "../../ventanas/ComentarioFlotante";

import usersData from "../../data/userData";
import menuItems from "../../data/menuItems";
import postsData from "../../data/postData";
import perfilData from "../../data/perfilData";

// importe de las bases
import Base_Main from "../../bases/Base_Main";
import Base_AsideIZ from "../../bases/Base_AsideIZ";
import Base_AsideDE from "../../bases/Base_AsideDE";

// Helper para obtener usuario de forma segura
const getUsuarioLogeado = () => {
  try {
    const data = localStorage.getItem("usuarioLogeado");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error al leer usuario:", error);
    return null;
  }
};

const Perfil = () => {

  const usuarioLogeado = getUsuarioLogeado();

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Posts y comentarios
  const [posts, setPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  // Kudos
  const [kudosCounts, setKudosCounts] = useState(
    postsData.reduce((acc, post) => {
      acc[post.id] = post.kudos || 0;
      return acc;
    }, {})
  );
  const [kudosCountsComentarios, setKudosCountsComentarios] = useState({});
  const [clickedKudos, setClickedKudos] = useState(null);

  // Edit/Delete
  const [clickedEdit, setClickedEdit] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);

  // Toggle aside y dropdown
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comentarioVisibleId, setComentarioVisibleId] = useState(null);

  useEffect(() => {
    if (!usuarioLogeado) {
      navigate("/");
      return;
    }
    const usuarioEncontrado = perfilData.find(u => u.correo === usuarioLogeado.correo);
    setUsuario(usuarioEncontrado);

    // Carga posts del usuario
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const userPosts = savedPosts.filter(p => p.author === usuarioEncontrado.nombre);
    setPosts(userPosts);
  }, [navigate, usuarioLogeado]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogeado");
    navigate("/");
  };

  const handleKudosClick = (postId) => {
    setKudosCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
    setClickedKudos(postId);
    setTimeout(() => setClickedKudos(null), 300);
  };

  const handleComentarioKudosClick = (comentarioId, postId) => {
    setKudosCountsComentarios(prev => ({
      ...prev,
      [comentarioId]: (prev[comentarioId] || 0) + 1
    }));
    setClickedKudos(comentarioId);
    setTimeout(() => setClickedKudos(null), 300);
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

  const toggleComentario = (postId) => {
    setComentarioVisibleId(prev => (prev === postId ? null : postId));
  };

  const handleAgregarComentario = (postId, texto) => {
    const nuevoComentario = {
      id: Date.now(),
      author: usuario.nombre,
      text: texto,
      avatar: usuario.imagen,
    };

    const newPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), nuevoComentario]
        };
      }
      return post;
    });

    setPosts(newPosts);

    // Actualiza localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const updatedPostsLS = savedPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), nuevoComentario]
        };
      }
      return post;
    });
    localStorage.setItem("posts", JSON.stringify(updatedPostsLS));

    setComentarioVisibleId(null);
  };

  if (!usuario) return null;


  return (
    <div className="perfil-grid">
        {/* ASIDE IZQUIERDO - usando la base */}
        <Base_AsideIZ usuario={usuarioLogeado} />

        {/* MAIN - usando la base */}
        <Base_Main tituloPagina="Perfil">
            {/* CONTENIDO ESPECÍFICO DE PERFIL */}

            {/* Imagen de perfil */}
            <div className="perfil-main-content">
                <div className="perfil-main-ima-perf">
                    <img src={usuario.imagen} alt="Imagen de perfil" />
                </div>
                <div className="perfil-descrip-perf">
                    <h2>{usuario.nombre}</h2>
                    <p>{usuario.descripcion}</p>
                </div>
            </div>

            {/* Contenido del perfil */}
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
                                        <i className="bi bi-pencil-square"></i>
                                        <i className="bi bi-trash"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="perfil-all-post">
                        {posts.map(post => (
                            <div key={post.id} className="perfil-blog-post">
                                <div className="perfil-post-perf">
                                    {/* Autor */}
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
                                                    onSubmit={texto => handleAgregarComentario(post.id, texto)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="perfil-post">
                                        <p>{post.content}</p>
                                    </div>

                                    {/* Imagen */}
                                    {post.image && (
                                        <div className="perfil-post-ima">
                                            <img className="perfil-ima-pub" src={post.image} alt="imagen-post" />
                                        </div>
                                    )}

                                    {/* Interacciones */}
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

                                {/* Comentarios */}
                                {post.comments && post.comments.length > 0 && (
                                    <div className="perfil-comentarios-lista">
                                        {post.comments.map(c => (
                                            <div key={c.id} className="perfil-comentario-item">
                                                <div className="perfil-comentario-header">
                                                    <img className="perfil-comentario-avatar" src={c.avatar} alt={`Avatar de ${c.author}`} />
                                                    <div className="perfil-comentario-info">
                                                        <span className="perfil-comentario-autor">{c.author}</span>
                                                        <span className="perfil-comentario-texto"> respondió</span>
                                                    </div>
                                                </div>
                                                <div className="perfil-comentario-contenido">
                                                    <p>{c.text}</p>
                                                </div>
                                                <div className="perfil-opciones-comentario">
                                                    <button className="perfil-check-comentario" type="button">[check]</button>
                                                    <button
                                                        className={`perfil-kudos-comentario ${clickedKudos === c.id ? 'clicked' : ''}`}
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
        </Base_Main>

        {/* ASIDE DERECHO - usando la base */}
        <Base_AsideDE />
    </div>
  );
}

export default Perfil;