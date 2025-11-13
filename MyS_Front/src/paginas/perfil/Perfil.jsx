// MySpace\MyS_Front\src\paginas\perfil\Perfil.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout";
import ComentarioFlotante from "../../ventanas/ComentarioFlotante";
import "./Perfil.css";

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
    const navigate = useNavigate();
    const usuarioLogeado = getUsuarioLogeado();
    
    const [usuario, setUsuario] = useState(null);
    const [posts, setPosts] = useState([]);
    const [kudosCounts, setKudosCounts] = useState({});
    const [kudosCountsComentarios, setKudosCountsComentarios] = useState({});
    const [clickedKudos, setClickedKudos] = useState(null);
    const [comentarioVisibleId, setComentarioVisibleId] = useState(null);

    // Verificar si el usuario está logeado
    useEffect(() => {
        console.log("Usuario logeado:", usuarioLogeado);
        
        if (!usuarioLogeado) {
            console.log("No hay usuario logeado, redirigiendo a /cuenta");
            navigate("/cuenta");
            return;
        }

        // Usar directamente el usuario del localStorage
        setUsuario(usuarioLogeado);

        // Cargar posts del usuario desde localStorage
        const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        const userPosts = savedPosts.filter(
            p => p.author === usuarioLogeado.nombre || 
                 p.author === usuarioLogeado.nom_usuario
        );
        
        console.log("Posts del usuario:", userPosts);
        setPosts(userPosts);

        // Inicializar kudos counts
        const initialKudos = userPosts.reduce((acc, post) => {
            acc[post.id] = post.kudos || 0;
            return acc;
        }, {});
        setKudosCounts(initialKudos);

    }, [navigate, usuarioLogeado]);

    // Manejar kudos en posts
    const handleKudosClick = (postId) => {
        setKudosCounts(prev => ({
            ...prev,
            [postId]: (prev[postId] || 0) + 1,
        }));
        setClickedKudos(postId);
        setTimeout(() => setClickedKudos(null), 300);
    };

    // Manejar kudos en comentarios
    const handleComentarioKudosClick = (comentarioId) => {
        setKudosCountsComentarios(prev => ({
            ...prev,
            [comentarioId]: (prev[comentarioId] || 0) + 1
        }));
        setClickedKudos(comentarioId);
        setTimeout(() => setClickedKudos(null), 300);
    };

    // Toggle ventana de comentarios
    const toggleComentario = (postId) => {
        setComentarioVisibleId(prev => (prev === postId ? null : postId));
    };

    // Agregar comentario
    const handleAgregarComentario = (postId, texto) => {
        const nuevoComentario = {
            id: Date.now(),
            author: usuario.nombre,
            text: texto,
            avatar: usuario.imagen,
        };

        // Actualizar posts en estado
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

        // Actualizar localStorage
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

    // Función para cerrar sesión
    const handleCerrarSesion = () => {
        localStorage.removeItem("usuarioLogeado");
        navigate("/cuenta");
    };

    // Si no hay usuario, mostrar loading o null
    if (!usuario) {
        return (
            <MainLayout tituloPagina="Perfil" gridClass="perfil-grid">
                <div className="perfil-loading">
                    <p>Cargando perfil...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout tituloPagina="Perfil" gridClass="perfil-grid">
            {/* CONTENIDO DEL PERFIL */}
            <div className="perfil-main-content">
                {/* Imagen y descripción de perfil */}
                <div className="perfil-header">
                    <div className="perfil-main-ima-perf">
                        <img src={usuario.imagen} alt="Imagen de perfil" />
                    </div>
                    <div className="perfil-descrip-perf">
                        <h2>{usuario.nombre}</h2>
                        <p>{usuario.descripcion || "Sin descripción"}</p>
                        <button 
                            onClick={handleCerrarSesion}
                            style={{
                                marginTop: '10px',
                                padding: '5px 15px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Sección de posts */}
                <div className="perfil-main-blog">
                    <hr />
                    <div className="perfil-blog-area">
                        {/* Navbar de opciones */}
                        <div className="perfil-main-navbar">
                            <div className="perfil-navbar-left">
                                <ul className="perfil-navbar-ul">
                                    <li><button>[Hashtags]</button></li>
                                    <li><button>[Imágenes]</button></li>
                                </ul>
                            </div>
                            <div className="perfil-navbar-right">
                                <ul className="perfil-mod">
                                    <li>
                                        <a href="/editar" title="Editar perfil">
                                            <i className="bi bi-pencil-square"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Lista de posts */}
                        <div className="perfil-all-post">
                            {posts.length === 0 ? (
                                <div className="perfil-sin-posts">
                                    <p>No has publicado nada aún</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <div key={post.id} className="perfil-blog-post">
                                        <div className="perfil-post-perf">
                                            {/* Información del autor */}
                                            <div className="perfil-info-main">
                                                <img 
                                                    className="perfil-ima-inf" 
                                                    src={post.avatar} 
                                                    alt="foto perfil" 
                                                />
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

                                            {/* Contenido del post */}
                                            <div className="perfil-post">
                                                <p>{post.content}</p>
                                            </div>

                                            {/* Imagen del post */}
                                            {post.image && (
                                                <div className="perfil-post-ima">
                                                    <img 
                                                        className="perfil-ima-pub" 
                                                        src={post.image} 
                                                        alt="imagen-post" 
                                                    />
                                                </div>
                                            )}

                                            {/* Botones de interacción */}
                                            <div className="perfil-opciones-botton">
                                                <button className="perfil-check" type="button">
                                                    [check]
                                                </button>
                                                <button
                                                    className={`perfil-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                                                    onClick={() => handleKudosClick(post.id)}
                                                    title={`${kudosCounts[post.id] || 0} kudos`}
                                                >
                                                    <i className="bi bi-bug-fill"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comentarios del post */}
                                        {post.comments && post.comments.length > 0 && (
                                            <div className="perfil-comentarios-lista">
                                                {post.comments.map(c => (
                                                    <div key={c.id} className="perfil-comentario-item">
                                                        <div className="perfil-comentario-header">
                                                            <img 
                                                                className="perfil-comentario-avatar" 
                                                                src={c.avatar} 
                                                                alt={`Avatar de ${c.author}`} 
                                                            />
                                                            <div className="perfil-comentario-info">
                                                                <span className="perfil-comentario-autor">
                                                                    {c.author}
                                                                </span>
                                                                <span className="perfil-comentario-texto">
                                                                    {" "}respondió
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="perfil-comentario-contenido">
                                                            <p>{c.text}</p>
                                                        </div>
                                                        <div className="perfil-opciones-comentario">
                                                            <button 
                                                                className="perfil-check-comentario" 
                                                                type="button"
                                                            >
                                                                [check]
                                                            </button>
                                                            <button
                                                                className={`perfil-kudos-comentario ${clickedKudos === c.id ? 'clicked' : ''}`}
                                                                onClick={() => handleComentarioKudosClick(c.id)}
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
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Perfil;