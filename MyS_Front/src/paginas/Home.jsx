// MySpace\MyS_Front\src\paginas\Home.jsx

import React from "react";
import MainLayout from "../components/Layout";
import "./Home.css";

const Home = () => {
  return (
    <MainLayout 
      tituloPagina="Principal"
      gridClass="home-grid"
    >
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
    </MainLayout>
  );
};

export default Home;