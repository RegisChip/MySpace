// MySpace\MyS_Front\src\bases\Base_AsideIZ.jsx

import React, { useState, useEffect } from "react";
import "./Base_Aside.css";
import { getPerfiles, getSiguiendoPerfil } from "../Api";

const Base_AsideIZ = ({ usuario, maxUsuarios = 10 }) => {
    // Elementos necesarios para el aside izquierdo
    const [isOpen, setIsOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleAside = () => setIsOpen((prev) => !prev); // Funcion para abrir y cerrar

    useEffect(() => {

        const cargarUsuarios = async () => {
            try {

                setLoading(true);
                setError(null);

                // Si no hay algun usuario logeado, muestra perfiles aleatorios
                if (!usuario || !usuario.perfil || !usuario.perfil.id) {
                    // Mensajes para la consola del navegador: perfiles aleatorios
                    console.log("Cargando perfiles recomendados...");
                    const response = await getPerfiles();
                    console.log("Respuesta getPerfiles:", response);
                    console.log("Tipo de respuesta:", typeof response);
                    console.log("Es Array?:", Array.isArray(response));
                    console.log("Keys del objeto:", Object.keys(response));

                    // Intenta extraer el array de perfiles de diferentes estructuras posibles
                    let perfiles = [];

                    if (Array.isArray(response)) {
                        perfiles = response;
                    } else if (response && Array.isArray(response.results)) {
                        // Paginación de DRF
                        perfiles = response.results;
                    } else if (response && Array.isArray(response.data)) {
                        // Otra estructura común
                        perfiles = response.data;
                    } else if (response && Array.isArray(response.perfiles)) {
                        perfiles = response.perfiles;
                    }

                    // Mensajes para la consola del navegador: validacion de perfiles extraidos
                    console.log("Perfiles extraídos:", perfiles);

                    if (perfiles.length === 0) {
                        // Mensajes para la consola del navegador: perfiles no encontrados
                        console.warn("No se encontraron perfiles");
                        setUsuarios([]);
                        return;
                    }

                    // Mezclar aleatoriamente y tomar maxUsuarios
                    const shuffled = [...perfiles].sort(() => 0.5 - Math.random());
                    const seleccionados = shuffled.slice(0, maxUsuarios);
                    
                    // Mensajes para la consola del navegador: perfiles seleccionados
                    console.log("Perfiles seleccionados:", seleccionados);

                    setUsuarios(seleccionados.map(perfil => ({
                        id: perfil.id,
                        avatar: perfil.foto_perfil || "/default-avatar.png",
                        name: perfil.nom_usuario
                    })));

                } else { // Si hay usuario logeado, muestra solo los que sigue

                    // Mensajes para la consola del navegador: perfiles que sigue el usuario
                    console.log(`Cargando perfiles seguidos por ${usuario.perfil.nom_usuario}...`);
                    const response = await getSiguiendoPerfil(usuario.perfil.id);
                    console.log("Respuesta getSiguiendoPerfil:", response);
                    console.log("Tipo de respuesta:", typeof response);
                    console.log("Es Array?:", Array.isArray(response));
                    console.log("Keys del objeto:", Object.keys(response));
                    
                    // Intentar extraer el array de diferentes estructuras posibles
                    let seguidores = [];

                    if (Array.isArray(response)) {
                        seguidores = response;
                    } else if (response && Array.isArray(response.results)) {
                        seguidores = response.results;
                    } else if (response && Array.isArray(response.data)) {
                        seguidores = response.data;
                    } else if (response && Array.isArray(response.siguiendo)) {
                        seguidores = response.siguiendo;
                    }
                    
                    // Mensajes para la consola del navegador: validacion de perfiles extraidos
                    console.log("Seguidores extraídos:", seguidores);
                    
                    if (seguidores.length === 0) {
                        // Mensajes para la consola del navegador: perfiles no encontrados
                        console.warn("No sigues a nadie");
                        setUsuarios([]);
                        return;
                    }
                    
                    // Mapeao a formato del componente
                    const seguidos = seguidores.map(seg => ({
                        id: seg.perfil_seguido,
                        avatar: seg.seguido_info?.foto_perfil || "/default-avatar.png",
                        name: seg.seguido_info?.nom_usuario || seg.seguido_nombre || "Usuario"
                    }));
                    
                    // Mensajes para la consola del navegador: perfiles seleccionados
                    console.log("Perfiles seguidos mapeados:", seguidos);
                    
                    setUsuarios(seguidos.slice(0, maxUsuarios));
                }
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
                console.error("Detalles:", err.message, err.stack);
                setError("No se pudieron cargar los usuarios");
            } finally {
                setLoading(false);
            }
        };

        cargarUsuarios();

    }, [usuario?.perfil?.id, maxUsuarios])

    return (

        <aside className={`aside-base aside-izquierdo ${isOpen ? "open" : "closed"}`}>
            <div className="aside-contenedor">

                {/* BOTÓN TOGGLE */}
                <div className="aside-boton-contenedor izq">
                    <button 
                        className="aside-boton" 
                        onClick={toggleAside}
                        aria-label={isOpen ? "Cerrar menú izquierdo" : "Abrir menú izquierdo"}
                    >
                        <img
                            src={isOpen ? "/flecha-izq.svg" : "/flecha-der.svg"}
                            alt="Alternar menú izquierdo"
                            className="aside-icono"
                        />
                    </button>
                </div>

                {/* CONTENIDO */}
                {isOpen && (
                    <div className="aside-cuerpo">
                        <h3 className="aside-titulo">
                            {usuario ? "Siguiendo" : "Recomendados"}
                        </h3>

                        {loading ? (
                            <p className="aside-sin-datos">Cargando...</p>
                        ) : error? (
                            <p className="aside-sin-datos" style={{ color: 'red' }}>{error}</p>
                        ) : (
                            <ul className="aside-lista scroll-personalizado">
                                {usuarios.length === 0 ? (
                                    <li className="aside-sin-datos">
                                        {usuario ? "No sigues a nadie aún" : "No hay usuarios disponibles"}
                                    </li>

                                ) : (
                                    usuarios.map(({ id, avatar, name }) => (
                                        <li key={id} className="aside-item">
                                            <img
                                                src={avatar}
                                                alt={`Avatar de ${name}`}
                                                className="aside-avatar"
                                            />
                                            <a href={`/perfil/${id}`} className="aside-nombre">
                                                {name}
                                            </a>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                )}
                
            </div>
        </aside>

    );
};

export default Base_AsideIZ;