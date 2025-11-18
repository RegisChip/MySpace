// MySpace\MyS_Front\src\paginas\tableros\General.jsx
import React, { useState, useEffect, useCallback } from "react";
// Estructura visual
import MainLayout from "../../components/Layout";
import "./General.css";
// Componentes para publicar
import PostFlotante from "../../ventanas/PostFlotante";
import ComentarioFlotante from "../../ventanas/ComentarioFlotante";
// importaciones de las funciones de API
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
    // Elementos necesarios para general
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
        const usuario = getUsuarioActual();
        const auth = estaAutenticado();
        console.log("Usuario actual:", usuario);
        console.log("Autenticado:", auth);
        setUsuarioLogeado(usuario);
        setAutenticado(auth);
    }, []);
    
    // =============================
    // HELPERS
    // =============================
    const formatearFecha = useCallback((fecha) => {
        return new Date(fecha).toLocaleString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);
    
    const formatearPublicacion = useCallback((pub, usuarioPerfil = null) => ({
        id: pub.id,
        perfilId: pub.perfil,
        author: usuarioPerfil?.nom_usuario || pub.perfil_info?.nom_usuario || "Usuario",
        avatar: usuarioPerfil?.foto_perfil || pub.perfil_info?.foto_perfil || "/default-avatar.png",
        date: formatearFecha(pub.fecha_pub || new Date()),
        content: pub.texto || pub.content,
        image: pub.image || pub.fotos?.[0]?.ruta_foto || null,
        kudos: pub.like_pub || 0,
    }), [formatearFecha]);
    
    const formatearComentario = useCallback((com) => ({
        id: com.id,
        author: com.perfil_info?.nom_usuario || "Usuario",
        avatar: com.perfil_info?.foto_perfil || "/default-avatar.png",
        text: com.texto,
        kudos: com.like_com || 0,
        fecha: formatearFecha(com.fecha_com),
    }), [formatearFecha]);
    
    const validarUsuarioConPerfil = useCallback(() => {
        if (!autenticado) {
            alert("Debes iniciar sesión");
            return false;
        }
        if (!usuarioLogeado?.perfil?.id) {
            console.error("Usuario sin perfil:", usuarioLogeado);
            alert("Error: No se encontró el perfil del usuario");
            return false;
        }
        return true;
    }, [autenticado, usuarioLogeado]);
    
    // =============================
    // PUBLICACIONES Y COMENTARIOS
    // =============================
    useEffect(() => {
        const cargarPublicaciones = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await getPublicaciones();
                const publicaciones = Array.isArray(data) ? data : data.results || [];
                
                console.log(`${publicaciones.length} publicaciones cargadas`);
                
                const publicacionesFormateadas = publicaciones.map(pub => formatearPublicacion(pub));
                setPosts(publicacionesFormateadas);
            } catch (err) {
                console.error("Error al cargar publicaciones:", err);
                setError("No se pudieron cargar las publicaciones");
            } finally {
                setLoading(false);
            }
        };
        
        cargarPublicaciones();
    }, [formatearPublicacion]);
    
    const cargarComentarios = useCallback(async (postId) => {
        if (comentariosPorPost[postId]) return;
        
        try {
            console.log(`Cargando comentarios para post ${postId}...`);
            const comentarios = await getComentariosPorPublicacion(postId);
            const comentariosFormateados = comentarios.map(formatearComentario);
            
            setComentariosPorPost(prev => ({
                ...prev,
                [postId]: comentariosFormateados
            }));
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
        }
    }, [comentariosPorPost, formatearComentario]);
    
    useEffect(() => {
        if (posts.length === 0) return;
        
        const cargarTodosLosComentarios = async () => {
            await Promise.all(posts.map(post => cargarComentarios(post.id)));
            
            const visibilidadInicial = Object.fromEntries(
                posts.map(post => [post.id, true])
            );
            setMostrarComentariosDePost(visibilidadInicial);
        };
        
        cargarTodosLosComentarios();
    }, [posts.length, cargarComentarios]);
    
    const toggleComentario = useCallback((postId) => {
        setComentarioVisibleId(prev => prev === postId ? null : postId);
    }, []);
    
    const toggleMostrarComentarios = useCallback(async (postId) => {
        const estaVisible = mostrarComentariosDePost[postId];
        
        setMostrarComentariosDePost(prev => ({
            ...prev,
            [postId]: !estaVisible
        }));
        
        if (!estaVisible && !comentariosPorPost[postId]) {
            await cargarComentarios(postId);
        }
    }, [mostrarComentariosDePost, comentariosPorPost, cargarComentarios]);
    
    // ===============
    //  KUDOS (LIKES)
    // ===============
    const handleKudos = useCallback(async (id, tipo = "post", postId = null) => { 
        if (!autenticado) {
            alert("Debes iniciar sesión para dar kudos");
            return;
        }
        
        try {
            console.log(`Dando kudos a ${tipo} ${id}...`);
            
            const result = tipo === "post" 
                ? await darLikePublicacion(id)
                : await darLikeComentario(id);
            
            if (tipo === "post") {
                setPosts(prev => prev.map(post => 
                    post.id === id ? { ...post, kudos: result.likes } : post
                ));
            } else {
                setComentariosPorPost(prev => ({
                    ...prev,
                    [postId]: prev[postId]?.map(com =>
                        com.id === id ? { ...com, kudos: result.likes } : com
                    ) || prev[postId]
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
    }, [autenticado]);
    
    // ================================
    //  CREAR PUBLICACION Y COMENTARIO
    // ================================
    const handleAddPost = useCallback(async (nuevoPost) => {
        if (!validarUsuarioConPerfil()) return;
        
        if (!nuevoPost.content?.trim()) {
            alert("El contenido no puede estar vacío");
            return;
        }
        
        try {
            console.log("Creando publicación...");
            
            const resultado = await crearPublicacion({
                content: nuevoPost.content.trim(),
                perfil: usuarioLogeado.perfil.id,
                image: nuevoPost.image || null
            });
            
            console.log("Publicación creada:", resultado);
            
            const nuevoPostFormateado = formatearPublicacion(
                { ...resultado, texto: nuevoPost.content },
                usuarioLogeado.perfil
            );
            
            setPosts(prev => [nuevoPostFormateado, ...prev]);
            setShowPostFlotante(false);
            
        } catch (err) {
            console.error("Error al crear publicación:", err);
            
            if (err.message.includes("autenticado")) {
                alert("Tu sesión expiró. Por favor inicia sesión nuevamente.");
                setAutenticado(false);
                setUsuarioLogeado(null);
            } else {
                alert(`Error al crear la publicación: ${err.message}`);
            }
        }
    }, [validarUsuarioConPerfil, usuarioLogeado, formatearPublicacion]);
    
    const handleAddComentario = useCallback(async (postId, nuevoComentario) => {
        if (!validarUsuarioConPerfil()) return;
        
        if (!nuevoComentario?.trim()) {
            alert("El comentario no puede estar vacío");
            return;
        }
        
        try {
            console.log("Creando comentario...");
            
            const resultado = await crearComentario({
                texto: nuevoComentario.trim(),
                publicacion: postId,
                perfil: usuarioLogeado.perfil.id
            });
            
            console.log("Comentario creado:", resultado);
            
            const nuevoComentarioObj = {
                id: resultado.id,
                author: usuarioLogeado.perfil.nom_usuario,
                avatar: usuarioLogeado.perfil.foto_perfil || "/default-avatar.png",
                text: nuevoComentario.trim(),
                kudos: 0,
                fecha: formatearFecha(new Date()),
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
                alert(`Error al crear el comentario: ${err.message}`);
            }
        }
    }, [validarUsuarioConPerfil, usuarioLogeado, formatearFecha]);
    
    // =============================
    // RENDER HELPERS
    // =============================
    const renderComentario = useCallback((comentario, postId) => (
        <div key={comentario.id} className="general-comentario-item">
            <div className="general-comentario-header">
                <img 
                    className="general-comentario-avatar" 
                    src={comentario.avatar} 
                    alt={`Avatar de ${comentario.author}`} 
                />
                <div className="general-comentario-info">
                    <span className="general-comentario-autor">{comentario.author}</span>
                    <span className="general-comentario-texto"> respondió</span>
                </div>
            </div>
            <div className="general-comentario-contenido">
                <p>{comentario.text}</p>
            </div>
            <div className="general-opciones-comentario">
                <button className="general-check-comentario" type="button">
                    [check]
                </button>
                <button
                    className={`general-kudos-comentario ${clickedKudos === comentario.id ? 'clicked' : ''}`}
                    onClick={() => handleKudos(comentario.id, "comentario", postId)}
                    title={`${comentario.kudos || 0} kudos`}
                    disabled={!autenticado}
                >
                    <i className="bi bi-bug-fill"></i>
                </button>
            </div>
        </div>
    ), [clickedKudos, autenticado, handleKudos]);
    
    const renderPost = useCallback((post) => (
        <div className="general-blog-post" key={post.id}>
            <div className="general-post-perf">
                {/* ENCABEZADO */}
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
                            }}
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
                
                {/* CONTENIDO */}
                <div className="general-post">
                    <p>{post.content}</p>
                </div>
                
                {/* IMAGEN */}
                {post.image && (
                    <div className="general-post-ima">
                        <img className="general-ima-pub" src={post.image} alt="imagen-post" />
                    </div>
                )}
                
                {/* BOTONES */}
                <div className="general-opciones-botton">
                    <button className="general-check" type="button">
                        [check]
                    </button>
                    <button
                        className={`general-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudos(post.id, "post")}
                        title={`${post.kudos || 0} kudos`}
                        disabled={!autenticado}
                    >
                        <i className="bi bi-bug-fill"></i>
                    </button>
                    <button
                        className="general-ver-comentarios"
                        onClick={() => toggleMostrarComentarios(post.id)}
                        type="button"
                    >
                        {mostrarComentariosDePost[post.id] ? '[-] Ocultar' : '[+] Ver'} comentarios
                    </button>
                </div>
            </div>
            
            {/* COMENTARIOS */}
            {mostrarComentariosDePost[post.id] && 
             comentariosPorPost[post.id] && 
             comentariosPorPost[post.id].length > 0 && (
                <div className="general-comentarios-lista">
                    {comentariosPorPost[post.id].map(c => renderComentario(c, post.id))}
                </div>
            )}
        </div>
    ), [
        autenticado,
        clickedKudos,
        comentarioVisibleId,
        comentariosPorPost,
        mostrarComentariosDePost,
        toggleComentario,
        handleAddComentario,
        handleKudos,
        toggleMostrarComentarios,
        renderComentario
    ]);
    
    // =============================
    // RENDERIZADO PRINCIPAL
    // =============================
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
                                <button onClick={() => {
                                    if (!autenticado) {
                                        alert("Debes iniciar sesión para crear posts");
                                        return;
                                    }
                                    setShowPostFlotante(true);
                                }}>
                                    [Crear Post]
                                </button>
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
                    </nav>
                    
                    <div className="general-all-post">
                        {posts.length === 0 ? (
                            <p style={{ textAlign: "center", padding: "2rem" }}>
                                No hay publicaciones aún
                            </p>
                        ) : (
                            posts.map(renderPost)
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default General;