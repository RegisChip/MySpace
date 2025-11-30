// MySpace\MyS_Front\src\layouts\MainLayout.jsx

import React from "react";
import { Link } from "react-router-dom";
import Base_AsideIZ from "../bases/Base_AsideIZ";
import Base_AsideDE from "../bases/Base_AsideDE";
import "./Layout.css";

/**
 * Layout principal que envuelve toda la aplicación
 * Maneja la estructura: aside-izq | header+main | aside-der + footer
 * 
 * @param {Object} props
 * @param {string} props.tituloPagina - Título que aparece en el header
 * @param {React.ReactNode} props.children - Contenido principal de la página
 * @param {Object} props.asideIzqConfig - Configuración del aside izquierdo
 * @param {Object} props.asideDeConfig - Configuración del aside derecho
 * @param {boolean} props.mostrarAsideIzq - Mostrar/ocultar aside izquierdo
 * @param {boolean} props.mostrarAsideDe - Mostrar/ocultar aside derecho
 * @param {string} props.gridClass - Clase CSS personalizada para el grid
 * @param {boolean} props.mostrarFooterMain - Mostrar/ocultar footer del main (W3C badges)
 */
const MainLayout = ({
  tituloPagina = "MySpace",
  children,
  asideIzqConfig = {},
  asideDeConfig = {},
  mostrarAsideIzq = true,
  mostrarAsideDe = true,
  gridClass = "layout-grid",
  mostrarFooterMain = true
}) => {
  
  // Obtener usuario logeado de forma segura
  const getUsuarioLogeado = () => {
    try {
      const data = localStorage.getItem("usuarioLogeado");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error al leer usuario:", error);
      return null;
    }
  };

  const usuarioLogeado = getUsuarioLogeado();

  return (
    <div className={gridClass}>
      {/* ASIDE IZQUIERDO */}
      {mostrarAsideIzq && (
        <Base_AsideIZ 
          usuario={usuarioLogeado}
          {...asideIzqConfig}
        />
      )}

      {/* CONTENEDOR PRINCIPAL (Header + Main + Footer del Main) */}
      <div className="layout-main-wrapper">
        {/* HEADER */}
        <header className="layout-header">
          <h1>
            <Link to="/">MySpace</Link>
          </h1>
          <p>{tituloPagina}</p>
        </header>

        {/* MAIN */}
        <main className="layout-main">
          {children}

          {/* FOOTER DEL MAIN (W3C Badges) */}
          {mostrarFooterMain && (
            <footer className="layout-main-footer">
                <p>
                  <a href="https://validator.w3.org/nu/?doc=https://mynetspace.ddns.net" target="_blank" rel="noreferrer">
                    <img style={{ border: 0, width: "88px", height: "31px" }}
                        src="https://www.w3.org/Icons/valid-html401"
                        alt="Valid HTML!" />
                  </a>
                </p>

                <p>
                    <a href="https://jigsaw.w3.org/css-validator/check/referer" target="_blank">
                        <img style={{ border: 0, width: "88px", height: "31px" }} 
                            src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
                            alt="Valid CSS!" />
                    </a>
                </p>

            </footer>
          )}
        </main>
      </div>

      {/* ASIDE DERECHO */}
      {mostrarAsideDe && (
        <Base_AsideDE {...asideDeConfig} />
      )}

      {/* FOOTER GLOBAL */}
      <footer className="layout-footer">
        <ul>
          <li><Link to="#">Acerca de</Link> |</li>
          <li><Link to="#">Reglas</Link> |</li>
          <li><Link to="#">Términos y condiciones</Link> |</li>
          <li><Link to="#">Privacidad</Link> |</li>
          <li><Link to="#">Contacto</Link></li>
        </ul>
        <p>&copy;2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default MainLayout;