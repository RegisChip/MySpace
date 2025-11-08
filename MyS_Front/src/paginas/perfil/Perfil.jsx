// src/paginas/perfil/Perfil.jsx

import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PostFlotante from "../../ventanas/PostFlotante";
import ComentarioFlotante from "../../ventanas/ComentarioFlotante";

import postsData from "../../data/postData";
import perfilData from "../../data/perfilData";

// importe de las bases
import Base_Main from "../../bases/Base_Main";
import Base_AsideIZ from "../../bases/Base_AsideIZ";
import Base_AsideDE from "../../bases/Base_AsideDE";

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

const Perfil = () => {

  // --- Datos principales ---
  const usuarioLogeado = getUsuarioLogeado();

  return (
    <div className="perfil-grid">
            {/* ASIDE IZQUIERDO - usando la base */}
            <Base_AsideIZ usuario={usuarioLogeado} />

            {/* MAIN - usando la base */}
            <Base_Main tituloPagina="Perfil">
            </Base_Main>

            {/* ASIDE DERECHO - usando la base */}
            <Base_AsideDE />
    </div>
  );
}

export default Perfil;