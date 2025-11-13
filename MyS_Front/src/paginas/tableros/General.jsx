// MySpace\MyS_Front\src\paginas\tableros\General.jsx

import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../components/Layout";
import PostFlotante from "../../ventanas/PostFlotante";
import ComentarioFlotante from "../../ventanas/ComentarioFlotante";
import "./General.css";

// Importar funciones de la API
import { 
  getPublicaciones, 
  getComentariosPorPublicacion,
  darLikePublicacion,
  darLikeComentario,
  crearPublicacion,
  crearComentario,
  estaAutenticado,
  getUsuarioActual
} from "../../Api";

const General = () => {
    // --- Estado principal ---
    const [usuarioLogeado, setUsuarioLogeado] = useState(getUsuarioActual());
    const [autenticado, setAutenticado] = useState(estaAutenticado());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comentariosPorPost, setComentariosPorPost] = useState({});
    const [clickedKudos, setClickedKudos] = useState(null);
    const [comentarioVisibleId, setComentarioVisibleId] = useState(null);
    const [showPostFlotante, setShowPostFlotante] = useState(false);
    const [mostrarComentariosDePost, setMostrarComentariosDePost] = useState({});
    
    // Verificar autenticación al montar
    useEffect(() => {
        setUsuarioLogeado(getUsuarioActual());
        setAutenticado(estaAutenticado());
    }, []);
    
    // Cargar publicaciones (PÚBLICO - no requiere token)
    useEffect(() => {
        const cargarPublicaciones = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPublicaciones();
                const publicaciones = Array.isArray(data)
                    ? data
                    : Array.isArray(data.results)
                        ? data.results
                        : [];
                const publicacionesFormateadas = publicaciones.map(pub => ({
                    id: pub.id,
                    perfilId: pub.perfil,
                    author: pub.perfil_info?.nom_usuario || "Usuario",
                    avatar: pub.perfil_info?.foto_perfil || "/default-avatar.png",
                    date: new Date(pub.fecha_pub).toLocaleString("es-MX", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    content: pub.texto,
                    image: pub.fotos && pub.fotos.length > 0 ? pub.fotos[0].ruta_foto : null,
                    kudos: pub.like_pub,
                }));
                setPosts(publicacionesFormateadas);
            } catch (err) {
                console.error("Error al cargar publicaciones:", err);
                setError("No se pudieron cargar las publicaciones");
            } finally {
                setLoading(false);
            }
        };
        
        cargarPublicaciones();
    }, []);
    
    // Cargar comentarios (PÚBLICO - no requiere token)
    const cargarComentarios = async (postId) => {
        if (comentariosPorPost[postId]) {
            return;
        }
        
        try {
            const comentarios = await getComentariosPorPublicacion(postId);
            
            const comentariosFormateados = comentarios.map(com => ({
                id: com.id,
                author: com.perfil_info?.nom_usuario || "Usuario",
                avatar: com.perfil_info?.foto_perfil || "/default-avatar.png",
                text: com.texto,
                kudos: com.like_com,
                fecha: new Date(com.fecha_com).toLocaleString("es-MX"),
            }));
            
            setComentariosPorPost(prev => ({
                ...prev,
                [postId]: comentariosFormateados
            }));
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
        }
    };
    
    // Cargar comentarios al montar el componente
    useEffect(() => {
        const cargarTodosLosComentarios = async () => {
            if (posts.length > 0) {
                const promesas = posts.map(post => cargarComentarios(post.id));
                await Promise.all(promesas);
                
                const todosVisibles = {};
                posts.forEach(post => {
                    todosVisibles[post.id] = true;
                });
                setMostrarComentariosDePost(todosVisibles);
            }
        };
        
        cargarTodosLosComentarios();
    }, [posts.length]);
    
    // Toggle para mostrar/ocultar comentarios
    const toggleMostrarComentarios = async (postId) => {
        if (mostrarComentariosDePost[postId]) {
            setMostrarComentariosDePost(prev => ({
                ...prev,
                [postId]: false
            }));
        } else {
            setMostrarComentariosDePost(prev => ({
                ...prev,
                [postId]: true
            }));
            
            if (!comentariosPorPost[postId]) {
                await cargarComentarios(postId);
            }
        }
    };
    
    // Dar kudos (REQUIERE AUTENTICACIÓN)
    const handleKudos = useCallback(async (id, tipo = "post") => {
        if (!autenticado) {
            alert("Debes iniciar sesión para dar kudos");
            return;
        }
        
        try {
            if (tipo === "post") {
                const result = await darLikePublicacion(id);
                setPosts(prev => prev.map(post => 
                    post.id === id ? { ...post, kudos: result.likes } : post
                ));
            } else {
                const result = await darLikeComentario(id);
                setComentariosPorPost(prev => ({
                    ...prev,
                    [comentarioVisibleId]: prev[comentarioVisibleId].map(com =>
                        com.id === id ? { ...com, kudos: result.likes } : com
                    )
                }));
            }
            
            setClickedKudos(id);
            setTimeout(() => setClickedKudos(null), 300);
        } catch (err) {
            console.error("Error al dar kudos:", err);
            if (err.message.includes("autenticado")) {
                alert("Tu sesión expiró. Por favor inicia sesión nuevamente.");
                setAutenticado(false);
                setUsuarioLogeado(null);
            } else {
                alert("Error al dar kudos");
            }
        }
    }, [autenticado, comentarioVisibleId]);
    
    // Toggle comentarios
    const toggleComentario = useCallback(
        (postId) => {
            if (comentarioVisibleId === postId) {
                setComentarioVisibleId(null);
            } else {
                setComentarioVisibleId(postId);
            }
        },
        [comentarioVisibleId]
    );
    
    // Crear nuevo post (REQUIERE AUTENTICACIÓN)
    const handleAddPost = useCallback(
        async (nuevoPost) => {
            if (!autenticado) {
                alert("Debes iniciar sesión para crear publicaciones");
                return;
            }
            
            try {
                const postData = {
                    texto: nuevoPost.content,
                    perfil: usuarioLogeado.perfil.id,
                    fotos_rutas: nuevoPost.image ? [nuevoPost.image] : []
                };
                
                const resultado = await crearPublicacion(postData);
                
                const nuevoPostFormateado = {
                    id: resultado.id,
                    perfilId: resultado.perfil,
                    author: usuarioLogeado.perfil.nom_usuario,
                    avatar: usuarioLogeado.perfil.foto_perfil || "/default-avatar.png",
                    date: new Date().toLocaleString("es-MX", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    content: nuevoPost.content,
                    image: nuevoPost.image || null,
                    kudos: 0,
                };
                
                setPosts(prev => [nuevoPostFormateado, ...prev]);
                setShowPostFlotante(false);
            } catch (err) {
                console.error("Error al crear publicación:", err);
                if (err.message.includes("autenticado")) {
                    alert("Tu sesión expiró. Por favor inicia sesión nuevamente.");
                    setAutenticado(false);
                    setUsuarioLogeado(null);
                } else {
                    alert("Error al crear la publicación");
                }
            }
        }, [autenticado, usuarioLogeado]
    );
    
    // Crear comentario (REQUIERE AUTENTICACIÓN)
    const handleAddComentario = useCallback(
        async (postId, nuevoComentario) => {
            if (!autenticado) {
                alert("Debes iniciar sesión para comentar");
                return;
            }
            
            try {
                const comentarioData = {
                    texto: nuevoComentario,
                    publicacion: postId,
                    perfil: usuarioLogeado.perfil.id
                };
                
                const resultado = await crearComentario(comentarioData);
                
                const nuevoComentarioObj = {
                    id: resultado.id,
                    author: usuarioLogeado.perfil.nom_usuario,
                    avatar: usuarioLogeado.perfil.foto_perfil || "/default-avatar.png",
                    text: nuevoComentario,
                    kudos: 0,
                    fecha: new Date().toLocaleString("es-MX"),
                };
                
                setComentariosPorPost(prev => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), nuevoComentarioObj]
                }));
                
                setMostrarComentariosDePost(prev => ({
                    ...prev,
                    [postId]: true
                }));
                
                setComentarioVisibleId(null);
            } catch (err) {
                console.error("Error al crear comentario:", err);
                if (err.message.includes("autenticado")) {
                    alert("Tu sesión expiró. Por favor inicia sesión nuevamente.");
                    setAutenticado(false);
                    setUsuarioLogeado(null);
                } else {
                    alert("Error al crear el comentario");
                }
            }
        }, [autenticado, usuarioLogeado]
    );
    
    if (loading) {
        return (
            <MainLayout tituloPagina="General" gridClass="general-grid">
                <div className="main-blog">
                    <p style={{ textAlign: "center", padding: "2rem" }}>
                        Cargando publicaciones...
                    </p>
                </div>
            </MainLayout>
        );
    }
    
    if (error) {
        return (
            <MainLayout tituloPagina="General" gridClass="general-grid">
                <div className="main-blog">
                    <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                        {error}
                    </p>
                </div>
            </MainLayout>
        );
    }
    
    return (
        <MainLayout tituloPagina="General" gridClass="general-grid">
            <div className="main-blog">
                <hr />
                <div className="blog-area">
                    <nav className="main-navbar">
                        <ul className="navbar-list">
                            <li>
                                <button 
                                    onClick={() => {
                                        if (!autenticado) {
                                            alert("Debes iniciar sesión para crear posts");
                                            return;
                                        }
                                        setShowPostFlotante(true);
                                    }}>
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
                        {posts.length === 0 ? (
                            <p style={{ textAlign: "center", padding: "2rem" }}>
                                No hay publicaciones aún
                            </p>
                        ) : (
                            posts.map((post) => (
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
                                                    onClick={() => {
                                                        if (!autenticado) {
                                                            alert("Debes iniciar sesión para comentar");
                                                            return;
                                                        }
                                                        toggleComentario(post.id);
                                                    }}>
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
                                            <button className="general-check" type="button">
                                                [check]
                                            </button>
                                            <button
                                                className={`general-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                                                onClick={() => handleKudos(post.id, "post")}
                                                title={`${post.kudos || 0} kudos`}
                                                disabled={!autenticado}>
                                                <i className="bi bi-bug-fill"></i>
                                            </button>
                                            
                                            <button
                                                className="general-ver-comentarios"
                                                onClick={() => toggleMostrarComentarios(post.id)}
                                                type="button">
                                                {mostrarComentariosDePost[post.id] ? '[-] Ocultar' : '[+] Ver'} comentarios
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {mostrarComentariosDePost[post.id] && comentariosPorPost[post.id] && comentariosPorPost[post.id].length > 0 && (
                                        <div className="general-comentarios-lista">
                                            {comentariosPorPost[post.id].map(c => (
                                                <div key={c.id} className="general-comentario-item">
                                                    <div className="general-comentario-header">
                                                        <img 
                                                            className="general-comentario-avatar" 
                                                            src={c.avatar} 
                                                            alt={`Avatar de ${c.author}`} 
                                                        />
                                                        <div className="general-comentario-info">
                                                            <span className="general-comentario-autor">{c.author}</span>
                                                            <span className="general-comentario-texto"> respondió</span>
                                                        </div>
                                                    </div>
                                                    <div className="general-comentario-contenido">
                                                        <p>{c.text}</p>
                                                    </div>
                                                
                                                    <div className="general-opciones-comentario">
                                                        <button className="general-check-comentario" type="button">
                                                            [check]
                                                        </button>
                                                        <button
                                                            className={`general-kudos-comentario ${clickedKudos === c.id ? 'clicked' : ''}`}
                                                            onClick={() => handleKudos(c.id, "comentario")}
                                                            title={`${c.kudos || 0} kudos`}
                                                            disabled={!autenticado}>
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
        </MainLayout>
    );
}

export default General;