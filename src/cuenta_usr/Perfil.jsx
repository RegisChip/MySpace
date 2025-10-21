import React from 'react';
import './Perfil.css';

import usersData from '../data/userData';
import menuItems from '../data/menuItems';

const Perfil = () => {
  return (
    <div className="perfil-content-grid">
      <aside className="perfil-aside-izq">
        <div className="perfil-contenedor">
          <div className="perfil-boton-container">
            <button className="perfil-fle-izq">
              <img src="/flecha-izq.svg" alt="Menu-izq" className="perfil-fle-ico" />
            </button>
          </div>
          <div className="perfil-cont-izq">
            <h3>Siguiendo</h3>
            <div className="perfil-izq-perf">
              <div className="perfil-izq-arti">
                <ul className="perfil-menu-perf">
                  {usersData.map(user => (
                    <li key={user.id}>
                      <img src={user.avatar} alt={`Avatar de ${user.name}`} />
                      <a href="#">{user.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <header className="perfil-head-base">
        <h1><a href="/">MySpace</a></h1>
        <p>Perfil</p>
      </header>

      <main className="perfil-main-base">
        <div className="perfil-main-content">
          <div className="perfil-main-ima-perf">
            <img src="/user.svg" alt="foto de perfil" />
          </div>
          <div className="perfil-descrip-perf">
            <h2>Nombre</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptas accusantium...
            </p>
          </div>
        </div>

        <div className="perfil-main-blog">
          <hr />
          <div className="perfil-blog-area">
            <div className="perfil-main-navbar">
              <div className="perfil-navbar-left">
                <ul className="perfil-navbar-ul">
                  <li><a href="#">[Hashtags]</a></li>
                  <li><a href="#">[Imágenes]</a></li>
                </ul>
              </div>
              <div className="perfil-navbar-right">
                <ul className="perfil-mod">
                  <li>
                    <a href="#">
                      <i className="bi bi-pencil-square"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="bi bi-trash"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="perfil-all-post">
              {[1, 2].map((post, index) => (
                <div className="perfil-blog-post" key={index}>
                  <div className="perfil-post-perf">
                    <div className="perfil-info-main">
                      <img className="perfil-ima-inf" src="/user.svg" alt="foto perfil" />
                      <h6 className="perfil-nombre">Nombre</h6>
                      <h6 className="perfil-public">Publicó</h6>
                      <h6 className="perfil-fecha">[dd/mm/aaaa - hh/mm/ss]</h6>
                      <button className="perfil-crear-coment">
                        <i className="bi bi-caret-right-fill"></i>
                      </button>
                    </div>
                    <div className="perfil-post">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                    </div>
                    {index === 0 && (
                      <div className="perfil-post-ima">
                        <img className="perfil-ima-pub" src="/hollow.jpg" alt="imagen-post" />
                      </div>
                    )}
                    <div className="perfil-opciones-botton">
                      <a className="perfil-check" href="#">[check]</a>
                      <button className="perfil-kudos">
                        <i className="bi bi-bug-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="perfil-main-foot">
          <p>
            <a href="https://validator.w3.org/#validate_by_input" target="_blank" rel="noreferrer">
              <img style={{ border: 0, width: '88px', height: '31px' }} src="/w3c-html.png" alt="Valid HTML!" />
            </a>
          </p>
          <p>
            <a href="https://jigsaw.w3.org/css-validator/#validate_by_input" target="_blank" rel="noreferrer">
              <img style={{ border: 0, width: '88px', height: '31px' }} src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS!" />
            </a>
          </p>
        </footer>
      </main>

      <aside className="perfil-aside-der">
        <button className="perfil-fle-der">
          <img src="/flecha-der.svg" alt="Menu-der" className="perfil-fle-ico" />
        </button>
        <article className="perfil-cont-der">
          <h3>Tablones</h3>
          <input type="text" placeholder="Buscar tablón..." name="buscar" />
          <ul className="perfil-list-der">
            {menuItems.map(item => (
              <li key={item.id}><a href={item.link}>{item.label}</a></li>
            ))}
          </ul>
        </article>
      </aside>

      <footer className="perfil-foot-base">
        <ul>
          <li><a href="#">Acerca de</a> |</li>
          <li><a href="#">Reglas</a> |</li>
          <li><a href="#">Términos y condiciones</a> |</li>
          <li><a href="#">Privacidad</a> |</li>
          <li><a href="#">Contacto</a> |</li>
        </ul>
        <p>&copy;2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Perfil;
