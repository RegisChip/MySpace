// MySpace\MyS_Front\src\bases\Base_AsideIZ.jsx

import React, { useState, useEffect } from "react";
import "./Base_Aside.css";
import usersData from "../data/userData";

/**
 * Componente Aside Izquierdo
 * Muestra usuarios recomendados o seguidos según si hay usuario logeado
 * 
 * @param {Object} props
 * @param {Object} props.usuario - Usuario logeado (puede ser null)
 * @param {number} props.maxUsuarios - Cantidad máxima de usuarios a mostrar
 */
const Base_AsideIZ = ({ usuario, maxUsuarios = 10 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    const toggleAside = () => setIsOpen((prev) => !prev);
    
    useEffect(() => {
        if (!usuario) {
            // Si no hay usuario logeado, muestra usuarios aleatorios
            const shuffled = [...usersData].sort(() => 0.5 - Math.random());
            setUsuarios(shuffled.slice(0, maxUsuarios));
        } else {
            // Si hay usuario logeado, muestra solo los que sigue
            const seguidos = usersData.filter((u) =>
                usuario.siguiendo?.includes(u.id)
            );
            setUsuarios(seguidos.slice(0, maxUsuarios));
        }
    }, [usuario, maxUsuarios]);
    
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
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Base_AsideIZ;