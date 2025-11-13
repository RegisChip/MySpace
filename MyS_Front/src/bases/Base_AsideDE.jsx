// MySpace\MyS_Front\src\bases\Base_AsideDE.jsx

import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Base_Aside.css";
import menuItems from "../data/menuItems";

/**
 * Helper para obtener usuario de forma segura
 */
const getUsuarioLogeado = () => {
    try {
        const data = localStorage.getItem("usuarioLogeado");
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error al leer el usuario:", error);
        return null;
    }
};

/**
 * Componente Aside Derecho
 * Muestra perfil del usuario y lista de tablones
 * Comportamiento especial en la página de perfil
 */
const Base_AsideDE = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [usuarioLogeado, setUsuarioLogeado] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });


    const navigate = useNavigate();
    const location = useLocation();

    const toggleAside = () => setIsOpen((prev) => !prev);
    
    const toggleDropdown = () => {
        if (!usuarioLogeado && location.pathname !== "/cuenta" && location.pathname !== "/registro") {
            setIsDropdownOpen(prev => !prev);
        } else {
            setIsDropdownOpen(prev => !prev);
        }

        if (!isDropdownOpen) {
            const rect = document.querySelector(".perfil-boton")?.getBoundingClientRect();
            if (rect) {
                setDropdownPos({
                    top: rect.bottom + window.scrollY, // justo debajo
                    left: rect.left + window.scrollX
                });
            }
        }
    };

    // Actualizar usuario al montar y cuando cambie localStorage
    useEffect(() => {
        setUsuarioLogeado(getUsuarioLogeado());
        
        const handleStorageChange = () => {
            setUsuarioLogeado(getUsuarioLogeado());
        };

        // Escuchar cambios en localStorage
        window.addEventListener("storage", handleStorageChange);
        
        // También escuchar un evento personalizado para cambios locales
        window.addEventListener("usuarioActualizado", handleStorageChange);
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("usuarioActualizado", handleStorageChange);
        };
    }, []);

    const esPerfil = location.pathname === "/perfil";
    const esEditar = location.pathname === "/editar";

    const cerrarSesion = () => {
        localStorage.removeItem("usuarioLogeado");
        setUsuarioLogeado(null);
        setIsDropdownOpen(false);
        
        // Disparar evento personalizado
        window.dispatchEvent(new Event("usuarioActualizado"));
        
        navigate("/");
    };

    const irAPerfil = () => {
        setIsDropdownOpen(false);
        navigate("/perfil");
    };

    const irAEditar = () => {
        setIsDropdownOpen(false);
        navigate("/editar");
    };

    const irALogin = () => {
        setIsDropdownOpen(false);
        navigate("/cuenta");
    };

    const irARegistro = () => {
        setIsDropdownOpen(false);
        navigate("/registro");
    };

    const renderOpcionesPerfil = () => {
        // Usuario NO logeado
        if (!usuarioLogeado) {
            return (
                <>
                    <li>
                        <button onClick={irALogin} className="boton-opcion">
                            Iniciar sesión
                        </button>
                    </li>
                    <li>
                        <button onClick={irARegistro} className="boton-opcion">
                            Registrarse
                        </button>
                    </li>
                </>
            );
        }

        // Usuario EN página de perfil
        if (esPerfil) {
            return (
                <>
                    <li>
                        <button onClick={irAEditar} className="boton-opcion">
                            Editar Perfil
                        </button>
                    </li>
                    <li>
                        <button onClick={cerrarSesion} className="boton-cerrar">
                            Cerrar sesión
                        </button>
                    </li>
                </>
            );
        }

        // Usuario EN página de editar
        if (esEditar) {
            return (
                <>
                    <li>
                        <button onClick={irAPerfil} className="boton-opcion">
                            Ver Perfil
                        </button>
                    </li>
                    <li>
                        <button onClick={cerrarSesion} className="boton-cerrar">
                            Cerrar sesión
                        </button>
                    </li>
                </>
            );
        }

        // Usuario logeado en OTRA página (Home, General, etc.)
        return (
            <>
                <li>
                    <button onClick={irAPerfil} className="boton-opcion">
                        Mi Perfil
                    </button>
                </li>
                <li>
                    <button onClick={cerrarSesion} className="boton-cerrar">
                        Cerrar sesión
                    </button>
                </li>
            </>
        );
    };

    // Filtrar tablones por búsqueda
    const tablonesFiltrados = menuItems.slice(1).filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className={`aside-base aside-derecho ${isOpen ? "open" : "closed"}`}>
            <div className="aside-contenedor">
                {/* BOTÓN TOGGLE */}
                <div className="aside-boton-contenedor der">
                    <button 
                        className="aside-boton" 
                        onClick={toggleAside}
                        aria-label={isOpen ? "Cerrar menú derecho" : "Abrir menú derecho"}
                    >
                        <img
                            src={isOpen ? "/flecha-der.svg" : "/flecha-izq.svg"}
                            alt="Alternar menú derecho"
                            className="aside-icono"
                        />
                    </button>
                </div>

                {/* CONTENIDO */}
                {isOpen && (
                    <div className="aside-contenido">
                        {/* SECCIÓN PERFIL */}
                        <div className="perfil-imagen">
                            <img
                                className="perfil-boton"
                                src={usuarioLogeado?.avatar || usuarioLogeado?.perfil?.foto_perfil || usuarioLogeado?.imagen || "/myspace.svg"}
                                alt="Foto de perfil"
                                onClick={toggleDropdown}
                                title={usuarioLogeado ? "Ver opciones de perfil" : "Iniciar sesión"}
                            />

                            {/* DROPDOWN */}
                            {isDropdownOpen &&
                                ReactDOM.createPortal(
                                    <div
                                        className="drop-contenido-portal"
                                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                                    >
                                        <ul>{renderOpcionesPerfil()}</ul>
                                    </div>,
                                    document.body
                                )
                            }

                        </div>

                        {/* MENÚ DE TABLONES */}
                        <article className="cont-tablones">
                            <h3>Tablones</h3>
                            <input
                                type="text"
                                className="busqueda-tablon"
                                placeholder="Buscar tablón..."
                                aria-label="Buscar tablón"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ul className="lista-tablones scroll-personalizado">
                                {tablonesFiltrados.length === 0 ? (
                                    <li className="aside-sin-datos">No se encontraron tablones</li>
                                ) : (
                                    tablonesFiltrados.map((item) => (
                                        <li key={item.id}>
                                            <a href={item.link}>{item.label}</a>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </article>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Base_AsideDE;