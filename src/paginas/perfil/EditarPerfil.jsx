// src/paginas/perfil/EditarPerfil.jsx

import React, { useState } from 'react';
import './EditarPerfil.css';

import menuItems from '../../data/menuItems';
import postsData from '../../data/postData';
import perfilData from '../../data/perfilData';

// importe de las bases
import Base_Main from "../../bases/Base_Main";
import Base_AsideIZ from "../../bases/Base_AsideIZ";
import Base_AsideDE from "../../bases/Base_AsideDE";
import { useNavigate } from 'react-router';



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

const EditarPerfil = () => {

    // --- Datos principales ---
    const usuarioLogeado = getUsuarioLogeado();
    //const [comentarioVisibleId, setComentarioVisibleId] = useState(null);
    const [activeTab, setActiveTab] = useState('comentarios');
    const navigate = useNavigate

    return (
        <div className='editar-grid'>
            {/* ASIDE IZQUIERDO - usando la base */}
            <Base_AsideIZ usuario={usuarioLogeado} />

            {/* MAIN - usando la base */}
            <Base_Main tituloPagina="Editar Perfil">
                <div className="edit-main-content">
                    {/* === PERFIL === */}
                    <div className="edit-cont-perfil">
                        <div className="edit-ima-perf">
                            <img src={usuarioLogeado.imagen} alt="foto de perfil" />
                            <button className="edit">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="delet">
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                        
                        <div className="edit-descrip-perf">
                            <div className="edit-nom">
                                <h2>{usuarioLogeado.nombre}</h2>
                                <button className="edit">
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div className="edit-desc">
                                <p>{usuarioLogeado.descripcion}</p>
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
                            defaultValue="13"/>
                        </div>
                    </div>

                    <hr />

                    {/* === POSTS / COMENTARIOS === */}
                    <div className="edit-com-post">
                        <h5>Post / Comentario</h5>

                        {/* Select dinámico */}
                        <div className="edit-tap">
                            <select name="opcion-tab" id="opcion-tab" defaultValue="">
                                <option value="" disabled>
                                    Seleccione un tablón...
                                </option>
                                {menuItems.slice(1).map((item, index) => (
                                    <option key={item.id} value={item.id}>
                                        {item.label} {/* se usa option para el select, no li */}
                                    </option>
                                ))}
                            </select>
                            <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            min="2025-01-01"
                            max="2030-12-31"/>
                        </div>

                        <div className="edit-pest">
                            <button 
                            data-tab="comentarios" 
                            className={activeTab === 'comentarios' ? 'active' : ''}
                            onClick={() => setActiveTab('comentarios')}>
                                Comentario
                            </button>
                            <button 
                            data-tab="publicaciones"
                            className={activeTab === 'publicaciones' ? 'active' : ''}
                            onClick={() => setActiveTab('publicaciones')}>
                                Publicaciones
                            </button>
                            <button 
                            data-tab="todo"
                            className={activeTab === 'todo' ? 'active' : ''}
                            onClick={() => setActiveTab('todo')}>
                                Todo
                            </button>

                        </div>

                        {/* Render dinámico de posts */}
                        <div className="content-edit">
                            <div className="tab-content comentarios activate">
                                <div className="all-post">
                                    {postsData.map((post) => (
                                        <div key={post.id} className="blog-post">
                                            <div className="post-perf">
                                                <div className="info-main">
                                                    <img
                                                    className="ima-inf"
                                                    src={post.avatar}
                                                    alt={`avatar de ${post.author}`}/>
                                                    <h6 className="nombre">{post.author}</h6>
                                                    <h6 className="public">Publicó</h6>
                                                    <h6 className="fecha">{post.date}</h6>
                                                </div>
                                                <div className="post">
                                                    <p>{post.content}</p>
                                                </div>
                                                {post.image && (
                                                    <div className="post-ima">
                                                        <img
                                                        className="ima-pub"
                                                        src={post.image}
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
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Base_Main>

            {/* ASIDE DERECHO - usando la base */}
            <Base_AsideDE />
        </div>
    );

}

export default EditarPerfil;