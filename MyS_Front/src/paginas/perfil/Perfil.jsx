// MySpace\MyS_Front\src\paginas\perfil\Perfil.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Estructura visual
import MainLayout from "../../components/Layout";
import "./Perfil.css";
// Componentes para publicar
import ComentarioFlotante from "../../ventanas/ComentarioFlotante";
// importaciones de las funciones de API
import {
    getPublicacionesPorPerfil,
    getComentariosPorPublicacion,
    getComentariosPorPerfil,
    darLikePublicacion,
    darLikeComentario,
    crearComentario,
    estaAutenticado,
    getUsuarioActual,
    logout
} from "../../Api";

const Perfil = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [perfil, setPerfil] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comentariosPorPost, setComentariosPorPost] = useState({});
    const [clickedKudos, setClickedKudos] = useState(null);
    const [comentarioVisibleId, setComentarioVisibleId] = useState(null);
    const [mostrarComentariosDePost, setMostrarComentariosDePost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [publicacionesConComentarios, setPublicacionesConComentarios] = useState([]);
    
    // Verifica la autenticación del usuario
    useEffect(() => {
        const usuarioLogeado = getUsuarioActual();
        console.log("Usuario logeado:", usuarioLogeado);
        
        if (!usuarioLogeado || !usuarioLogeado.perfil) {
            console.log("No hay usuario logeado o perfil, redirigiendo a /cuenta");
            navigate("/cuenta");
            return;
        }
        
        setUsuario(usuarioLogeado);
        setPerfil(usuarioLogeado.perfil);
        console.log("Perfil cargado:", usuarioLogeado.perfil);
    }, [navigate]);
    
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
    
    const procesarPublicaciones = useCallback(async (publicaciones, perfil) => {
        const postsFormateados = publicaciones.map(pub => ({
            id: pub.id,
            perfilId: pub.perfil,
            author: perfil.nom_usuario,
            avatar: perfil.foto_perfil || "/default-avatar.png",
            date: formatearFecha(pub.fecha_pub),
            content: pub.texto,
            image: pub.fotos?.[0]?.ruta_foto || null,
            kudos: pub.like_pub,
        }));
        
        if (postsFormateados.length > 0) {
            const comentariosPromises = postsFormateados.map(post => 
                cargarComentariosDePost(post.id)
            );
            await Promise.all(comentariosPromises);
        }
        
        return postsFormateados;
    }, [formatearFecha]);
    
    
    const procesarComentariosAjenos = useCallback((comentarios, perfil) => {
        const publicacionesMap = new Map();
        
        comentarios.forEach(comentario => {
            const pubInfo = comentario.publicacion_info;
            if (!pubInfo) return;
            
            // FILTRO: Si el post es del mismo perfil, NO se agrega
            // porque ya está en la sección de posts propios
            if (pubInfo.perfil === perfil.id) return;
            
            if (!publicacionesMap.has(pubInfo.id)) {
                publicacionesMap.set(pubInfo.id, {
                    id: pubInfo.id,
                    perfilId: pubInfo.perfil,
                    author: pubInfo.perfil_info?.nom_usuario || "Usuario",
                    avatar: pubInfo.perfil_info?.foto_perfil || "/default-avatar.png",
                    date: formatearFecha(pubInfo.fecha_pub),
                    content: pubInfo.texto,
                    image: null,
                    kudos: pubInfo.like_pub,
                    esComentarioAjeno: true,
                    comentariosDelPerfil: []
                });
            }
            
            publicacionesMap.get(pubInfo.id).comentariosDelPerfil.push({
                id: comentario.id,
                author: perfil.nom_usuario,
                avatar: perfil.foto_perfil || "/default-avatar.png",
                text: comentario.texto,
                kudos: comentario.like_com,
                fecha: formatearFecha(comentario.fecha_com),
            });
        });
        
        return Array.from(publicacionesMap.values());
    }, [formatearFecha]);
    
    const cargarComentariosDePost = useCallback(async (postId) => {
        if (comentariosPorPost[postId]) return;
        
        try {
            const comentarios = await getComentariosPorPublicacion(postId);
            
            const comentariosFormateados = comentarios.map(com => ({
                id: com.id,
                author: com.perfil_info?.nom_usuario || "Usuario",
                avatar: com.perfil_info?.foto_perfil || "/default-avatar.png",
                text: com.texto,
                kudos: com.like_com,
                fecha: formatearFecha(com.fecha_com),
            }));
            
            setComentariosPorPost(prev => ({
                ...prev,
                [postId]: comentariosFormateados
            }));
        } catch (err) {
            console.error(`Error al cargar comentarios del post ${postId}:`, err);
        }
    }, [comentariosPorPost, formatearFecha]);
    
    // ========================================
    //  PUBLICACIONES Y COMENTARIOS DEL PERFIL
    // ========================================
    useEffect(() => {
        if (!perfil?.id) return;
        
        const cargarContenidoDelPerfil = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log("Cargando contenido del perfil...");
                
                const [publicacionesData, comentariosData] = await Promise.all([
                    getPublicacionesPorPerfil(perfil.id),
                    getComentariosPorPerfil(perfil.id)
                ]);
                
                const publicaciones = Array.isArray(publicacionesData) 
                    ? publicacionesData 
                    : publicacionesData.results || [];
                
                const postsFormateados = await procesarPublicaciones(publicaciones, perfil);
                setPosts(postsFormateados);
                
                const postsConComentarios = procesarComentariosAjenos(comentariosData, perfil);
                setPublicacionesConComentarios(postsConComentarios);
                
                const todosLosIds = [
                    ...postsFormateados.map(p => p.id), 
                    ...postsConComentarios.map(p => p.id)
                ];
                const visibilidadInicial = Object.fromEntries(
                    todosLosIds.map(id => [id, true])
                );
                setMostrarComentariosDePost(visibilidadInicial);
                
                console.log("Contenido del perfil cargado");
                
            } catch (err) {
                console.error("Error al cargar contenido:", err);
                setError("No se pudo cargar el contenido del perfil");
            } finally {
                setLoading(false);
            }
        };
        
        cargarContenidoDelPerfil();
    }, [perfil?.id, procesarPublicaciones, procesarComentariosAjenos]);
    
    // =========
    //  TOGGLES Y KUDOS
    // =========
    const toggleMostrarComentarios = useCallback(async (postId) => {
        const estaVisible = mostrarComentariosDePost[postId];
        
        setMostrarComentariosDePost(prev => ({
            ...prev,
            [postId]: !estaVisible
        }));
        
        if (!estaVisible && !comentariosPorPost[postId]) {
            await cargarComentariosDePost(postId);
        }
    }, [mostrarComentariosDePost, comentariosPorPost, cargarComentariosDePost]);
    
    const toggleComentario = useCallback((postId) => {
        setComentarioVisibleId(prev => prev === postId ? null : postId);
    }, []);
    
    const manejarKudos = useCallback(async (id, tipo, postId = null) => {
        if (!estaAutenticado()) {
            alert("Debes iniciar sesión para dar kudos");
            return;
        }
        
        try {
            console.log(`Dando kudos a ${tipo} ${id}...`);
            
            const result = tipo === 'post' 
                ? await darLikePublicacion(id)
                : await darLikeComentario(id);
            
            if (tipo === 'post') {
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
            }
        }
    }, []);
    
    const handleKudosClick = useCallback((postId) => manejarKudos(postId, 'post'), [manejarKudos]);
    const handleComentarioKudosClick = useCallback((comentarioId, postId) => 
        manejarKudos(comentarioId, 'comentario', postId), [manejarKudos]
    );
    
    // ==========
    //  HANDLES
    // ==========
    const handleAgregarComentario = useCallback(async (postId, texto) => {
        if (!estaAutenticado() || !perfil?.id) {
            alert("Debes iniciar sesión para comentar");
            return;
        }
        
        if (!texto.trim()) {
            alert("El comentario no puede estar vacío");
            return;
        }
        
        try {
            console.log("Creando comentario...");
            
            const resultado = await crearComentario({
                texto: texto.trim(),
                publicacion: postId,
                perfil: perfil.id
            });
            
            const nuevoComentario = {
                id: resultado.id,
                author: perfil.nom_usuario,
                avatar: perfil.foto_perfil || "/default-avatar.png",
                text: texto.trim(),
                kudos: 0,
                fecha: formatearFecha(new Date()),
            };
            
            setComentariosPorPost(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), nuevoComentario]
            }));
            
            setMostrarComentariosDePost(prev => ({
                ...prev,
                [postId]: true
            }));
            
            setComentarioVisibleId(null);
            
            console.log("Comentario creado");
            
        } catch (err) {
            console.error("Error al crear comentario:", err);
            alert(`Error al crear el comentario: ${err.message || 'Intenta de nuevo'}`);
        }
    }, [perfil, formatearFecha]);
    
    const handleCerrarSesion = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            localStorage.removeItem("usuarioLogeado");
            navigate("/cuenta");
        }
    }, [navigate]);
    
    // =============================
    // RENDER HELPERS
    // =============================
    const renderComentario = useCallback((comentario, postId, esComentarioPropio = false) => (
        <div 
            key={comentario.id} 
            className="perfil-comentario-item"
            style={esComentarioPropio ? { backgroundColor: '#f0f8ff' } : {}}
        >
            <div className="perfil-comentario-header">
                <img 
                    className="perfil-comentario-avatar" 
                    src={comentario.avatar} 
                    alt={`Avatar de ${comentario.author}`}
                />
                <div className="perfil-comentario-info">
                    <span className="perfil-comentario-autor">
                        {comentario.author}
                    </span>
                    <span className="perfil-comentario-texto">
                        {esComentarioPropio ? ' comentó' : ' respondió'}
                    </span>
                </div>
            </div>
            <div className="perfil-comentario-contenido">
                <p>{comentario.text}</p>
            </div>
            <div className="perfil-opciones-comentario">
                <button 
                    className="perfil-check-comentario" 
                    type="button"
                >
                    [check]
                </button>
                <button
                    className={`perfil-kudos-comentario ${clickedKudos === comentario.id ? 'clicked' : ''}`}
                    onClick={() => handleComentarioKudosClick(comentario.id, postId)}
                    title={`${comentario.kudos || 0} kudos`}
                >
                    <i className="bi bi-bug-fill"></i>
                </button>
            </div>
        </div>
    ), [clickedKudos, handleComentarioKudosClick]);
    
    const renderPostPropio = useCallback((post) => (
        <div key={post.id} className="perfil-blog-post">
            <div className="perfil-post-perf">
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
                
                <div className="perfil-post">
                    <p>{post.content}</p>
                </div>
                
                {post.image && (
                    <div className="perfil-post-ima">
                        <img 
                            className="perfil-ima-pub" 
                            src={post.image} 
                            alt="imagen-post" 
                        />
                    </div>
                )}
                
                <div className="perfil-opciones-botton">
                    <button className="perfil-check" type="button">
                        [check]
                    </button>
                    <button
                        className={`perfil-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudosClick(post.id)}
                        title={`${post.kudos || 0} kudos`}
                    >
                        <i className="bi bi-bug-fill"></i>
                    </button>
                    <button
                        className="perfil-ver-comentarios"
                        onClick={() => toggleMostrarComentarios(post.id)}
                        type="button"
                    >
                        {mostrarComentariosDePost[post.id] ? '[-] Ocultar' : '[+] Ver'} comentarios
                    </button>
                </div>
            </div>
            
            {mostrarComentariosDePost[post.id] && 
             comentariosPorPost[post.id] && 
             comentariosPorPost[post.id].length > 0 && (
                <div className="perfil-comentarios-lista">
                    {comentariosPorPost[post.id].map(c => renderComentario(c, post.id, false))}
                </div>
            )}
        </div>
    ), [
        clickedKudos,
        comentarioVisibleId,
        comentariosPorPost,
        mostrarComentariosDePost,
        toggleComentario,
        handleAgregarComentario,
        handleKudosClick,
        toggleMostrarComentarios,
        renderComentario
    ]);
    
    const renderPostConComentarios = useCallback((post) => (
        <div 
            key={`comentario-${post.id}`} 
            className="perfil-blog-post" 
        >
            <div className="perfil-post-perf">
                <div className="perfil-info-main">
                    <img 
                        className="perfil-ima-inf" 
                        src={post.avatar} 
                        alt="foto perfil" 
                    />
                    <h6 className="perfil-nombre">{post.author}</h6>
                    <h6 className="perfil-public">Publicó</h6>
                    <h6 className="perfil-fecha">{post.date}</h6>
                </div>
                
                <div className="perfil-post">
                    <p>{post.content}</p>
                </div>
                
                {post.image && (
                    <div className="perfil-post-ima">
                        <img 
                            className="perfil-ima-pub" 
                            src={post.image} 
                            alt="imagen-post" 
                        />
                    </div>
                )}
                
                <div className="perfil-opciones-botton">
                    <button className="perfil-check" type="button">
                        [check]
                    </button>
                    <button
                        className={`perfil-kudos ${clickedKudos === post.id ? 'clicked' : ''}`}
                        onClick={() => handleKudosClick(post.id)}
                        title={`${post.kudos || 0} kudos`}
                    >
                        <i className="bi bi-bug-fill"></i>
                    </button>
                    <button
                        className="perfil-ver-comentarios"
                        onClick={() => toggleMostrarComentarios(post.id)}
                        type="button"
                    >
                        {mostrarComentariosDePost[post.id] ? '[-] Ocultar' : '[+] Ver'} tus comentarios
                    </button>
                </div>
            </div>
            
            {mostrarComentariosDePost[post.id] && 
             post.comentariosDelPerfil && 
             post.comentariosDelPerfil.length > 0 && (
                <div className="perfil-comentarios-lista">
                    {post.comentariosDelPerfil.map(c => renderComentario(c, post.id, true))}
                </div>
            )}
        </div>
    ), [
        clickedKudos,
        mostrarComentariosDePost,
        handleKudosClick,
        toggleMostrarComentarios,
        renderComentario
    ]);
    
    // =============================
    // RENDERIZADO PRINCIPAL
    // =============================
    if (!perfil) {
        return null;
    }
    
    return (
        <MainLayout tituloPagina="Perfil" gridClass="perfil-grid">
            <div className="perfil-main-content">
                {/* Header del perfil */}
                <div className="perfil-header">
                    <div className="perfil-main-ima-perf">
                        <img 
                            src={perfil.foto_perfil || "/default-avatar.png"} 
                            alt="Imagen de perfil" 
                        />
                    </div>
                    <div className="perfil-descrip-perf">
                        <h2>{perfil.nom_usuario}</h2>
                        <p>{perfil.perfil_info || "Sin descripción"}</p>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                            <p>Usuario: {usuario?.usuario?.correo}</p>
                        </div>
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
                            {loading ? (
                                <div className="perfil-sin-posts">
                                    <p>Cargando publicaciones...</p>
                                </div>
                            ) : error ? (
                                <div className="perfil-sin-posts" style={{ color: 'red' }}>
                                    <p>{error}</p>
                                </div>
                            ) : posts.length === 0 && publicacionesConComentarios.length === 0 ? (
                                <div className="perfil-sin-posts">
                                    <p>No has publicado ni comentado nada aún</p>
                                </div>
                            ) : (
                                <>
                                    {posts.map(renderPostPropio)}
                                    {publicacionesConComentarios.map(renderPostConComentarios)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Perfil;