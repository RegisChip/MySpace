// MySpace\MyS_Front\src\bases\Base_AsideDE.jsx

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Base_Aside.css";
import menuItems from "../data/menuItems";

const getUsuarioLogeado = () => {
  
  try {
    const data = localStorage.getItem("usuarioLogeado");
    return data ? JSON.parse(data): null;
  } catch(error) {
    console.error("Error al leer el usuario:", error);
    return null;
  }
}; // Ayuda a obtener el usuario logeado de forma segura

const Base_AsideDE = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleAside = () => setIsOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const usuarioLogeado = getUsuarioLogeado();
  const esPerfil = location.pathname === "/perfil";

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogeado");
    navigate("/"); // Redirige al inicio
  };

  const renderOpcionesPerfil = () => { // Renderiza opciones del dropdown

    // Cuando el usuario aun no esta logeado
    if (!usuarioLogeado) {
      return (
        <>
          <li><a href="/cuenta">Iniciar sesión</a></li>
          <li><a href="/registro">Registrarse</a></li>
        </>
      );
    }

    // Cuando esta en perfil
    if (esPerfil) {
      return (
        <>
          <li>
            <button onClick={cerrarSesion} className="boton-cerrar">
              Cerrar sesión
            </button>
          </li>
          <li><a href="/editar">Editar Perfil</a></li>
        </>
      );
    }

    // Otro caso general
    return (<li><a href="/perfil">Mi Perfil</a></li>);
  };

  return (
    <aside className={`aside-base aside-derecho ${isOpen ? "open" : "closed"}`}>
      <div className="aside-contenedor">
        {/* BOTÓN */}
        <div className="aside-boton-contenedor der">
          <button className="aside-boton" onClick={toggleAside}>
            <img
              src={isOpen ? "/flecha-der.svg" : "/flecha-izq.svg"}
              alt="Alternar menú derecho"
              className="aside-icono"
            />
          </button>
        </div>

        {/* CONTENIDO */}
        {isOpen && (
          <div>
            {/* SECCIÓN PERFIL */}
            <div className="perfil-imagen">

              {/* IMAGEN */}
              <img
                className="perfil-boton"
                src={usuarioLogeado?.avatar || "/myspace.svg"}
                alt="Foto de perfil"
                onClick={toggleDropdown}
              />

              {/* COMPORTAMIENTO */}
              {isDropdownOpen && (
                <div className="drop-contenido">
                  <ul>{renderOpcionesPerfil()}</ul>
                </div>
              )}
            </div>

            {/* MENÚ DE TABLONES */}
            <article className="cont-tablones">
              <h3>Tablones</h3>
              <input
                type="text"
                className="busqueda-tablon"
                placeholder="Buscar tablón..."
                aria-label="Buscar tablón"
              />
              <ul className="lista-tablones scroll-personalizado">
                {menuItems.slice(1).map((item) => (
                  <li key={item.id}>
                    <a href={item.link}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Base_AsideDE;