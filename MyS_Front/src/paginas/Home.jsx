// MySpace\MyS_Front\src\paginas\Home.jsx

import React from "react";
import "./Home.css";

// importe de las bases
import Base_Main from "../bases/Base_Main";
import Base_AsideIZ from "../bases/Base_AsideIZ";
import Base_AsideDE from "../bases/Base_AsideDE";

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

const Home  = () => {

  const usuarioLogeado = getUsuarioLogeado();

  return (
    <div className="home-grid">
      {/* ASIDE IZQUIERDO - usando la base */}
      <Base_AsideIZ usuario={usuarioLogeado} />

      {/* MAIN - usando la base */}
      <Base_Main tituloPagina="Principal">
        {/* CONTENIDO ESPECÍFICO DE HOME */}
        <div className="main-content">
          <article className="info-main">
            <h4>¿Qué es MySpace?</h4>
            <div className="text-main">
              <p>
                MySpace es un sitio web tipo red social, en el que los usuarios
                puedan compartir sus gustos e intereses de manera más efectiva,
                mediante la personalización de sus perfiles y la posibilidad de
                publicar en foros dedicados a sus preferencias. De esta forma,
                se crean espacios donde los usuarios puedan conocer e
                interactuar con otros perfiles.
              </p>
            </div>
          </article>

          <article className="info-main">
            <h4>Misión</h4>
            <div className="text-main">
              <p>
                Ofrecer un espacio digital libre y personalizable donde cada
                persona pueda compartir sus gustos, ideas y experiencias en
                tablones o foros temáticos, fomentando la creatividad, la
                autenticidad y la interacción genuina entre usuarios.
              </p>
              <img src="/mision.svg" alt="mision" />
            </div>
          </article>

          <article className="info-main">
            <h4>Visión</h4>
            <div className="text-main">
              <p>
                Ser la red social donde cada persona pueda sentirse libre y
                cómoda al expresarse, personalizar su espacio y compartir sus
                pasiones en tablones temáticos, creando comunidades auténticas
                y conectando con quienes disfrutan de lo mismo.
              </p>
              <img src="/vision.svg" alt="visión" />
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
      </Base_Main>

      {/* ASIDE DERECHO - usando la base */}
      <Base_AsideDE />
    </div>
  );
  
}

export default Home;