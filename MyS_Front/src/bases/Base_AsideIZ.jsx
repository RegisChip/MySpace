// MySpace\MyS_Front\src\bases\Base_AsideIZ.jsx

import React, { useState, useEffect } from "react";
import "./Base_Aside.css";
import usersData from "../data/userData"; // Lista de usuarios predefinida
import { Link } from "react-router-dom";

const Base_AsideIZ = ({ usuario }) => {

    const [isOpen, setIsOpen] = useState(false); // cerrado por defecto
    const [usuarios, setUsuarios] = useState([]);

    const toggleAside = () => setIsOpen((prev) => !prev);
    
    useEffect(() => {
        const MAX_USUARIOS = 7
        if (!usuario) {
            // Si no hay usuario logeado, mostrara n-cantidad de usuarios aleatorios
            const shuffled = [...usersData].sort(() => 0.5 - Math.random());
            setUsuarios(shuffled.slice(0, MAX_USUARIOS));
        } else {
            // Si hay usuario logeado, mostrara solo los que sigue
            const seguidos = usersData.filter((u) =>
                usuario.siguiendo?.includes(u.id)
            );
            setUsuarios(seguidos.slice(0, MAX_USUARIOS));
        }
    }, [usuario]);
    
    return (
        <aside className={`aside-base aside-izquierdo ${isOpen ? "open" : "closed"}`}>
            <div className="aside-contenedor">

                {/* BOTÓN */}
                <div className="aside-boton-contenedor izq">
                    <button className="aside-boton" onClick={toggleAside}>
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
                            {usuarios.map(({ id, avatar, name }) => (
                                <li key={id} className="aside-item">
                                    <img
                                    src={avatar}
                                    alt={`Avatar de ${name}`}
                                    className="aside-avatar"
                                    />
                                    <a href="#" className="aside-nombre">
                                        {name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Base_AsideIZ;