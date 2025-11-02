// src/bases/Base_Main.jsx

import React from "react";
import "./Base_Main.css"; // css del Main
import { Link } from "react-router-dom";

const Base_Main = ({ tituloPagina, children }) => {
    // Componente Base_Main que recibe el titulo de la pagina y children como props
    return(
        <div className="base">
            <div className="base-wrapper">

                {/* HEADER */}
                <header className="base-head">
                    <h1><Link to="/">MySpace</Link></h1>
                    {/* Enlace a la página principal */}
                    <p>{tituloPagina}</p>
                    {/* Muestra el título de la página actual */}
                </header>

                {/* MAIN */}
                <main className="base-main">
                    
                    {children} {/* Renderiza el contenido pasado como children de la pagina que quiera usar main */}

                    {/* FOOTER DEL MAIN */}
                    <footer className="base-main-foot">
                        <p>
                            <a
                            href="https://validator.w3.org/#validate_by_input" target="_blank"
                            rel="noreferrer"
                            >
                                <img
                                style={{ border: 0, width: '88px', height: '31px' }}
                                src="/w3c-html.png"
                                alt="Valid HTML!" 
                                />
                            </a>
                        </p>
                        
                        <p>
                            <a
                            href="https://jigsaw.w3.org/css-validator/#validate_by_input"
                            target="_blank"
                            rel="noreferrer"
                            >
                                <img
                                style={{ border: 0, width: '88px', height: '31px' }}
                                src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
                                alt="Valid CSS!" 
                                />
                            </a>
                        </p>
                    </footer>
                </main>

                {/* FOOTER */}
                <footer className="base-foot">
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
        </div>
    );
};

export default Base_Main;