// src/paginas/tablero/General.jsx

import React, {useState, useEffect, useCallback } from "react";
import "./General.css";

import PostFlotante from "../../ventanas/PostFlotante";
import ComentarioFlotante from "../../ventanas/ComentarioFlotante";

import postsData from '../../data/postData';
import comentarioData from '../../data/comentarioData';

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

const General  = () => {

    // --- Datos principales ---
    const usuarioLogeado = getUsuarioLogeado();
    const [kudosComentarios, setKudosComentarios] = useState({});
    const [clickedKudos, setClickedKudos] = useState(null);
    const [comentarioVisibleId, setComentarioVisibleId] = useState(null);
    const [showPostFlotante, setShowPostFlotante] = useState(false);

    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem("posts");
        return saved ? JSON.parse(saved) : postsData;
    });

    const [kudosCounts, setKudosCounts] = useState(() => posts.reduce(
        (acc, post) => (
            { ...acc, [post.id]: post.kudos || 0 }
        ), {}
    ));
    
    // Guarda posts solo si cambian
    useEffect(() => {
        const saved = localStorage.getItem("posts");
        const parsed = saved ? JSON.parse(saved) : [];
        if (JSON.stringify(parsed) !== JSON.stringify(posts)) {
            localStorage.setItem("posts", JSON.stringify(posts));
        }
    }, [posts]);
    
    // Manejo general de kudos (post o comentario)
    const handleKudos = useCallback((id, tipo = "post") => {
        const setFn = tipo === "post" ? setKudosCounts : setKudosComentarios;
        setFn(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        setClickedKudos(id);
        setTimeout(() => setClickedKudos(null), 300);
    }, []);
    
    // Muestra / oculta comentarios
    const toggleComentario = useCallback(
        (postId) =>
            setComentarioVisibleId(prev => (prev === postId ? null : postId)),
        []
    );
    
    // Nuevo post
    const handleAddPost = useCallback(
        (nuevoPost) => {
            const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
            const newPost = {
                id: newId,
                author: usuarioLogeado?.nombre || "Anónimo",
                avatar: usuarioLogeado?.imagen || "/default-avatar.png",
                date: new Date().toLocaleString("es-MX", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                content: nuevoPost.content,
                image: nuevoPost.image || null,
                comments: [],
                kudos: 0,
            };
            setPosts(prev => [newPost, ...prev]);
            setShowPostFlotante(false);
            setKudosCounts(prev => ({ ...prev, [newId]: 0 }));
        }, [posts, usuarioLogeado]
    );
    
    // Nuevo comentario
    const handleAddComentario = useCallback(
        (postId, nuevoComentario) => {
            setPosts(prev =>
                prev.map(post =>
                    post.id === postId ? {...post, comments: [
                        ...(post.comments || []), {
                            id: Date.now(),
                            author: usuarioLogeado?.nombre || "Anónimo",
                            avatar: usuarioLogeado?.imagen || "/default-avatar.png",
                            text: nuevoComentario,
                        },
                    ]}: post
                )
            );
            setComentarioVisibleId(null);
        }, [usuarioLogeado]
    );

    return (
        <div className="general-grid">
            {/* ASIDE IZQUIERDO - usando la base */}
            <Base_AsideIZ usuario={usuarioLogeado} />

            {/* MAIN - usando la base */}
            <Base_Main tituloPagina="General">
            <div className="main-blog">
                <hr />
                <div className="blog-area">
                    
                    <nav className="main-navbar">
                        <ul className="navbar-list">
                            <li>
                                <button onClick={() => setShowPostFlotante(true)}>
                                    [Crear Post]
                                </button>
                            </li>
                            <li>
                                <button>[Buscar]</button>
                            </li>
                            <li>
                                <button>[Hashtags]</button>
                            </li>
                        </ul>
                        {showPostFlotante && (
                            <PostFlotante
                                onClose={() => setShowPostFlotante(false)}
                                onAddPost={handleAddPost}
                            />
                        )}
                    </nav>

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
                                            onClick={() => toggleComentario(post.id)}>
                                                <i className="bi bi-caret-right-fill"></i>
                                            </button>

                                            {comentarioVisibleId === post.id && (
                                                <ComentarioFlotante
                                                onClose={() => setComentarioVisibleId(null)}
                                                onSubmit={(texto) => handleAddComentario(post.id, texto)}/>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contenido del post */}
                                    <div className="general-post">
                                        <p>{post.content}</p>
                                    </div>

                                    {post.image && (
                                        <div className="general-post-ima">
                                            <img className="general-ima-pub" src={post.image} alt="imagen-post" />
                                        </div>
                                    )}

                                    {/* Botones de opciones */}
                                    <div className="general-opciones-botton">
                                        <button className="general-check" type="button">
                                            [check]
                                        </button>
                                        <button
                                        className={`general-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                                        onClick={() => handleKudos(post.id, "post")}
                                        title={`${kudosCounts[post.id] || 0} kudos`}>
                                            <i className="bi bi-bug-fill"></i>
                                        </button>
                                    </div>
                                </div>

                                {post.comments && post.comments.length > 0 && (
                                    <div className="general-comentarios-lista">
                                        {post.comments.map(c => (
                                            <div key={c.id} className="general-comentario-item">
                                                <div className="general-comentario-header">
                                                    <img 
                                                    className="general-comentario-avatar" 
                                                    src={c.avatar} 
                                                    alt={`Avatar de ${c.author}`} />
                                                    <div className="general-comentario-info">
                                                        <span className="general-comentario-autor">{c.author}</span>
                                                        <span className="general-comentario-texto"> respondió</span>
                                                    </div>
                                                </div>
                                                <div className="general-comentario-contenido">
                                                    <p>{c.text}</p>
                                                </div>
                                            
                                                {/* BOTONES DE KUDOS Y CHECK PARA CADA COMENTARIO */}
                                                <div className="general-opciones-comentario">
                                                    <button className="general-check-comentario" type="button">
                                                        [check]
                                                    </button>
                                                    <button
                                                    className={`general-kudos-comentario ${clickedKudos === c.id ? 'clicked' : ''}`}
                                                    onClick={() => handleKudos(c.id, "comentario")}
                                                    title={`${kudosComentarios[c.id] || 0} kudos`}>
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

export default General;