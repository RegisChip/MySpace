import React, { useState } from "react";
import users from "../data/userData";
import menuItems from "../data/menuItems";
import "./Home.css";

export default function Home() {
  const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const toggleLeft = () => {
    setIsLeftOpen((prev) => {
      if (!prev) setIsRightOpen(false);
      return !prev;
    });
  };

  const toggleRight = () => {
    setIsRightOpen((prev) => {
      if (!prev) setIsLeftOpen(false);
      return !prev;
    });
  };

  return (
    <div className="content-grid">
      {/* ASIDE IZQUIERDO */}
      <aside id="aside-izq" className={isLeftOpen ? "open" : "closed"}>
        <div className="contenedor">
          <div className="boton-container">
            <button id="fle-izq" onClick={toggleLeft}>
              <img
                src={isLeftOpen ? "/flecha-izq.svg" : "/flecha-der.svg"}
                alt="Toggle menú izquierdo"
                className="fle-ico"
              />
            </button>
          </div>

          {isLeftOpen && (
            <div id="cont-izq">
              <h3>Perfiles</h3>
              <div className="izq-perf">
                <div id="izq-arti">
                  <ul className="menu-perf">
                    {users.map((user) => (
                      <li key={user.id}>
                        <img src={user.avatar} alt="user" />
                        <a href="#">{user.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* HEADER */}
      <header id="head-base">
        <h1>
          <a href="/" onClick={() => window.location.reload()}>MySpace</a>
        </h1>
        <p>Principal</p>
      </header>

      {/* MAIN */}
      <main id="main-base">
        <div className="main-content">
          <article className="info-main">
            <h4>¿Qué es MySpace?</h4>
            <div className="text-main">
              <p>
                MySpace es un sitio web tipo red social, en el que los usuarios puedan compartir sus gustos e intereses de manera más efectiva, mediante la personalización de sus perfiles y la posibilidad de publicar en foros dedicados a sus preferencias. De esta forma, se crean espacios donde los usuarios puedan conocer e interactuar con otros perfiles.
              </p>
            </div>
          </article>

          <article className="info-main">
            <h4>Misión</h4>
            <div className="text-main">
              <p>
                  Ofrecer un espacio digital libre y personalizable donde cada persona pueda compartir sus gustos, ideas y experiencias en tablones o foros temáticos, fomentando la creatividad, la autenticidad y la interacción genuina entre usuarios.
              </p>
              <img src="/mision.svg" alt="mision" />
            </div>
          </article>

          <article className="info-main">
            <h4>Visión</h4>
            <div className="text-main">
              <p>
                Ser la red social donde cada persona pueda sentirse libre y cómoda al expresarse, personalizar su espacio y compartir sus pasiones en tablones temáticos, creando comunidades auténticas y conectando con quienes disfrutan de lo mismo.
              </p>
              <img src="/vision.svg" alt="vision" />
            </div>
          </article>

          <article className="info-main">
            <h4>Valores</h4>
            <div className="text-main">
              <p>Integridad, Respeto, Honestidad.</p>
              <img src="/valores.svg" alt="valores" />
            </div>
          </article>
        </div>

        <footer id="main-foot">
          <p>
            <a
              href="https://validator.w3.org/#validate_by_input"
              target="_blank"
              rel="noreferrer"
            >
              <img
                style={{ border: 0, width: 88, height: 31 }}
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
                style={{ border: 0, width: 88, height: 31 }}
                src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
                alt="Valid CSS!"
              />
            </a>
          </p>
        </footer>
      </main>

      {/* ASIDE DERECHO */}
      <aside id="aside-der" className={isRightOpen ? "open" : "closed"}>
        <button id="fle-der" onClick={toggleRight}>
          <img
            src={isRightOpen ? "/flecha-der.svg" : "/flecha-izq.svg"}
            alt="Toggle menú derecho"
            className="fle-ico"
          />
        </button>

        {isRightOpen && (
          <>
            <div id="ima-perfil"> {/*hacer que tome la imagen de perfildata*/}
              <img
                id="btn-perfil"
                src="myspace.svg"
                alt="Foto de perfil"
                onClick={toggleDropdown}
              />

              {isDropdownOpen && (
                <div id="cont-dropdown">
                  <ul>
                    {usuarioLogeado ? (
                      <li>
                        <a href="/perfil">Mi Perfil</a>
                      </li>
                    ) : (
                      <li>
                        <a href="/cuenta">Iniciar Sesión / Registrarse</a>
                      </li>
                    )}
                  </ul>
                </div>
              )}

            </div>

            <article id="cont-der">
              <h3>Tablones</h3>
              <input
                type="text"
                id="busqueda-tablon"
                placeholder="Buscar tablón..."
              />
            <ul id="list-der">
            {menuItems.slice(1).map((item, index) => (
              <li key={item.id}>
                <a href={item.link}>{item.label}</a>
              </li>
              ))}
            </ul>
            </article>
          </>
        )}
      </aside>

      {/* FOOTER BASE */}
      <footer id="foot-base">
        <ul>
          <li><a href="#">Acerca de</a> |</li>
          <li><a href="#">Reglas</a> |</li>
          <li><a href="#">Términos</a> |</li>
          <li><a href="#">Privacidad</a> |</li>
          <li><a href="#">Contacto</a></li>
        </ul>
        <p>©2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
