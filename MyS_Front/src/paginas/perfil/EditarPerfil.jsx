// MySpace\MyS_Front\src\paginas\perfil\EditarPerfil.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';
import menuItems from '../../data/menuItems';
import Base_Main from "../../bases/Base_Main";
import Base_AsideIZ from "../../bases/Base_AsideIZ";
import Base_AsideDE from "../../bases/Base_AsideDE";
import {
    getPublicacionesPorPerfil,
    getComentariosPorPublicacion,
    getComentariosPorPerfil,
    getUsuarioActual
} from "../../Api";

const EditarPerfil = () => {
    const navigate = useNavigate();
    const [usuarioLogeado, setUsuarioLogeado] = useState(null);
    const [activeTab, setActiveTab] = useState('publicaciones');
    const [posts, setPosts] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTablon, setSelectedTablon] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    
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
    
    const formatearPublicacion = useCallback((pub, perfil) => ({
        id: pub.id,
        perfilId: pub.perfil,
        author: pub.perfil_info?.nom_usuario || perfil.nom_usuario,
        avatar: pub.perfil_info?.foto_perfil || perfil.foto_perfil || "/default-avatar.png",
        date: formatearFecha(pub.fecha_pub),
        content: pub.texto,
        image: pub.fotos?.[0]?.ruta_foto || null,
        kudos: pub.like_pub,
        fecha_pub: pub.fecha_pub,
        tipo: 'publicacion'
    }), [formatearFecha]);
    
    const formatearComentario = useCallback((com, perfil) => ({
        id: com.id,
        publicacionId: com.publicacion,
        perfilId: com.perfil,
        author: com.perfil_info?.nom_usuario || perfil.nom_usuario,
        avatar: com.perfil_info?.foto_perfil || perfil.foto_perfil || "/default-avatar.png",
        text: com.texto,
        kudos: com.like_com,
        date: formatearFecha(com.fecha_com),
        fecha_com: com.fecha_com,
        tipo: 'comentario'
    }), [formatearFecha]);
    
    // =============================
    // VERIFICACIÓN DE AUTENTICACIÓN
    // =============================
    useEffect(() => {
        const usuario = getUsuarioActual();
        
        if (!usuario) {
            console.log("No hay usuario logeado, redirigiendo a /cuenta");
            navigate("/cuenta");
            return;
        }
        
        console.log("Usuario logeado:", usuario);
        setUsuarioLogeado(usuario);
    }, [navigate]);
    
    // =============================
    // CARGA DE DATOS
    // =============================
    useEffect(() => {
        if (!usuarioLogeado?.perfil?.id) return;
        
        cargarPublicacionesYComentarios();
    }, [usuarioLogeado?.perfil?.id]);
    
    const cargarPublicacionesYComentarios = useCallback(async () => {
        if (!usuarioLogeado?.perfil?.id) {
            console.error("No hay usuario válido");
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            console.log("Cargando contenido del usuario ID:", usuarioLogeado.perfil.id);
            
            // Cargar publicaciones y comentarios en paralelo
            const [publicacionesData, comentariosData] = await Promise.all([
                getPublicacionesPorPerfil(usuarioLogeado.perfil.id),
                cargarComentariosDelUsuario()
            ]);
            
            // Procesar publicaciones
            const publicaciones = Array.isArray(publicacionesData)
                ? publicacionesData
                : publicacionesData.results || [];
            
            const publicacionesFormateadas = publicaciones.map(pub => 
                formatearPublicacion(pub, usuarioLogeado.perfil)
            );
            
            setPosts(publicacionesFormateadas);
            setComentarios(comentariosData);
            
            console.log(`${publicacionesFormateadas.length} publicaciones cargadas`);
            console.log(`${comentariosData.length} comentarios cargados`);
            
        } catch (err) {
            console.error("Error al cargar contenido:", err);
            setError("No se pudo cargar el contenido");
        } finally {
            setLoading(false);
        }
    }, [usuarioLogeado?.perfil, formatearPublicacion]);
    
    const cargarComentariosDelUsuario = useCallback(async () => {
        try {
            // Intentar usar endpoint específico primero
            if (typeof getComentariosPorPerfil === 'function') {
                try {
                    const comentariosDelUsuario = await getComentariosPorPerfil(usuarioLogeado.perfil.id);
                    return comentariosDelUsuario.map(com => 
                        formatearComentario(com, usuarioLogeado.perfil)
                    );
                } catch (endpointError) {
                    console.warn("Endpoint por-perfil no disponible, usando fallback");
                }
            }
            
            // Fallback: cargar desde publicaciones propias
            const publicacionesData = await getPublicacionesPorPerfil(usuarioLogeado.perfil.id);
            const publicaciones = Array.isArray(publicacionesData)
                ? publicacionesData
                : publicacionesData.results || [];
            
            const todosLosComentarios = [];
            
            for (const post of publicaciones) {
                const comentariosPost = await getComentariosPorPublicacion(post.id);
                const comentariosDelUsuario = comentariosPost
                    .filter(com => com.perfil === usuarioLogeado.perfil.id)
                    .map(com => formatearComentario(com, usuarioLogeado.perfil));
                
                todosLosComentarios.push(...comentariosDelUsuario);
            }
            
            return todosLosComentarios;
            
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
            return [];
        }
    }, [usuarioLogeado?.perfil, formatearComentario]);
    
    // =============================
    // FILTRADO DE CONTENIDO
    // =============================
    const getContenidoFiltrado = useCallback(() => {
        let contenido = [];
        
        // Seleccionar contenido según tab
        if (activeTab === 'publicaciones') {
            contenido = posts;
        } else if (activeTab === 'comentarios') {
            contenido = comentarios;
        } else if (activeTab === 'todo') {
            contenido = [...posts, ...comentarios].sort((a, b) => {
                const fechaA = new Date(a.fecha_pub || a.fecha_com);
                const fechaB = new Date(b.fecha_pub || b.fecha_com);
                return fechaB - fechaA;
            });
        }
        
        // Aplicar filtro de fecha
        if (selectedDate) {
            const filterDate = new Date(selectedDate);
            contenido = contenido.filter(item => {
                const itemDate = new Date(item.fecha_pub || item.fecha_com);
                return itemDate.toDateString() === filterDate.toDateString();
            });
        }
        
        // Aplicar filtro de tablón (si se implementa en el futuro)
        if (selectedTablon) {
            // TODO: filtrar por tablón cuando esté disponible
            console.log("Filtro de tablón seleccionado:", selectedTablon);
        }
        
        return contenido;
    }, [activeTab, posts, comentarios, selectedDate, selectedTablon]);
    
    // =============================
    // RENDER HELPERS
    // =============================
    const renderItem = useCallback((item) => (
        <div key={`${item.tipo}-${item.id}`} className="blog-post">
            <div className="post-perf">
                <div className="info-main">
                    <img
                        className="ima-inf"
                        src={item.avatar}
                        alt={`avatar de ${item.author}`}
                    />
                    <h6 className="nombre">{item.author}</h6>
                    <h6 className="public">
                        {item.tipo === 'comentario' ? 'Comentó' : 'Publicó'}
                    </h6>
                    <h6 className="fecha">{item.date}</h6>
                </div>
                
                <div className="post">
                    <p>{item.content || item.text}</p>
                </div>
                
                {item.image && (
                    <div className="post-ima">
                        <img
                            className="ima-pub"
                            src={item.image}
                            alt="imagen del post"
                        />
                    </div>
                )}
                
                <div className="opciones-botton">
                    <a className="check" href="#">
                        [check]
                    </a>
                    <button className="kudos">
                        <i className="bi bi-bug-fill"></i>
                        <span style={{ marginLeft: '5px', fontSize: '12px' }}>
                            {item.kudos || 0}
                        </span>
                    </button>
                    <div className="edit-buttons">
                        <button className="edit">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="delet">
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ), []);
    
    const renderContenido = useCallback(() => {
        if (loading) {
            return (
                <div className="edit-sin-datos">
                    <p>Cargando...</p>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="edit-sin-datos" style={{ color: 'red' }}>
                    <p>{error}</p>
                </div>
            );
        }
        
        const contenido = getContenidoFiltrado();
        
        if (contenido.length === 0) {
            const mensaje = activeTab === 'comentarios' 
                ? 'comentarios' 
                : activeTab === 'publicaciones' 
                    ? 'publicaciones' 
                    : 'contenido';
            
            return (
                <div className="edit-sin-datos">
                    <p>No hay {mensaje} para mostrar</p>
                </div>
            );
        }
        
        return (
            <div className="all-post">
                {contenido.map(renderItem)}
            </div>
        );
    }, [loading, error, activeTab, getContenidoFiltrado, renderItem]);
    
    // =============================
    // RENDERIZADO PRINCIPAL
    // =============================
    if (!usuarioLogeado) {
        return (
            <div className='editar-grid'>
                <Base_AsideIZ usuario={null} />
                <Base_Main tituloPagina="Editar Perfil">
                    <div className="edit-main-content">
                        <p>Cargando...</p>
                    </div>
                </Base_Main>
                <Base_AsideDE />
            </div>
        );
    }
    
    const contenidoFiltrado = getContenidoFiltrado();
    
    return (
        <div className='editar-grid'>
            <Base_AsideIZ usuario={usuarioLogeado} />
            
            <Base_Main tituloPagina="Editar Perfil">
                <div className="edit-main-content">
                    {/* === PERFIL === */}
                    <div className="edit-cont-perfil">
                        <div className="edit-ima-perf">
                            <img 
                                src={usuarioLogeado.perfil?.foto_perfil || "/default-avatar.png"} 
                                alt="foto de perfil" 
                            />
                            <button className="edit">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="delet">
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                        
                        <div className="edit-descrip-perf">
                            <div className="edit-nom">
                                <h2>
                                    {usuarioLogeado.perfil?.nom_usuario || usuarioLogeado.usuario?.nombre}
                                </h2>
                                <button className="edit">
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div className="edit-desc">
                                <p>{usuarioLogeado.perfil?.biografia || "Sin biografía disponible"}</p>
                                <div className="edit-desc-buttons">
                                    <button className="edit">
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="delet">
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <hr />
                    
                    {/* === CONFIGURACIÓN DE PÁGINA === */}
                    <div className="edit-page">
                        <h5>Página</h5>
                        <div className="edit-color-page">
                            <label>Color de página: </label>
                            <div>
                                <button>Editar</button>
                                <button>Borrar</button>
                            </div>
                        </div>
                        <div className="edit-color-fondo">
                            <label>Color de fondo: </label>
                            <div>
                                <button>Editar</button>
                                <button>Borrar</button>
                            </div>
                        </div>
                        <div className="edit-image-fondo">
                            <label>Imagen de fondo: </label>
                            <div>
                                <button>Editar</button>
                                <button>Borrar</button>
                            </div>
                        </div>
                        <div className="edit-tipo-font">
                            <label>Tipo de letra: </label>
                            <div>
                                <button>Editar</button>
                                <button>Borrar</button>
                            </div>
                        </div>
                        <div className="edit-tam">
                            <label>Tamaño de letra: </label>
                            <input
                                type="range"
                                id="tam-font"
                                name="tam-font"
                                min="0"
                                max="40"
                                defaultValue="13"
                            />
                        </div>
                    </div>
                    
                    <hr />
                    
                    {/* === POSTS / COMENTARIOS === */}
                    <div className="edit-com-post">
                        <h5>Post / Comentario</h5>
                        
                        {/* Filtros */}
                        <div className="edit-tap">
                            <select 
                                name="opcion-tab" 
                                id="opcion-tab" 
                                value={selectedTablon}
                                onChange={(e) => setSelectedTablon(e.target.value)}
                            >
                                <option value="">Todos los tablones</option>
                                {menuItems.slice(1).map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                min="2025-01-01"
                                max="2030-12-31"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        
                        {/* Tabs */}
                        <div className="edit-pest">
                            <button 
                                data-tab="comentarios" 
                                className={activeTab === 'comentarios' ? 'active' : ''}
                                onClick={() => setActiveTab('comentarios')}
                            >
                                Comentarios ({comentarios.length})
                            </button>
                            <button 
                                data-tab="publicaciones"
                                className={activeTab === 'publicaciones' ? 'active' : ''}
                                onClick={() => setActiveTab('publicaciones')}
                            >
                                Publicaciones ({posts.length})
                            </button>
                            <button 
                                data-tab="todo"
                                className={activeTab === 'todo' ? 'active' : ''}
                                onClick={() => setActiveTab('todo')}
                            >
                                Todo ({posts.length + comentarios.length})
                            </button>
                        </div>
                        
                        {/* Contenido dinámico */}
                        <div className="content-edit">
                            <div className="tab-content activate">
                                {renderContenido()}
                            </div>
                        </div>
                    </div>
                </div>
            </Base_Main>
            
            <Base_AsideDE />
        </div>
    );
};

export default EditarPerfil;