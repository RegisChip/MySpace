// src/paginas/logeo/Registro.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

// importe de la base
import Base_Main from "../../bases/Base_Main"; 

export default function Registro() {
  
  const navigate = useNavigate();

  //Datos del usuario
  const [nombre, setNombre] = useState("");
  const [apPaterno, setApPaterno] = useState("");
  const [apMaterno, setApMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const registrarUsuario = (e) => {
    e.preventDefault();
    if (pass1 !== pass2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // evita registrar dos correos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find((u) => u.correo === correo);
    if (existe) {
      alert("Este correo ya está registrado");
      return;
    }

    const nuevoUsuario = { nombre, apPaterno, apMaterno, correo, pass: pass1 };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
    alert("Usuario registrado correctamente");
    navigate("/cuenta");
  };

  return (
    <Base_Main tituloPagina="Registro">
      <div className="registro-contenido">
        <form className="registro-forma" onSubmit={registrarUsuario}>
          <table>
            <tbody>
              <tr>
                <td>Nombre</td>
                <td>
                  <input
                    type="text"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Apellido Paterno</td>
                <td>
                  <input
                    type="text"
                    name="apaterno"
                    value={apPaterno}
                    onChange={(e) => setApPaterno(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Apellido Materno</td>
                <td>
                  <input
                    type="text"
                    name="amaterno"
                    value={apMaterno}
                    onChange={(e) => setApMaterno(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Correo</td>
                <td>
                  <input
                    type="email"
                    name="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Contraseña</td>
                <td>
                  <input
                    type="password"
                    name="pass1"
                    value={pass1}
                    onChange={(e) => setPass1(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Repetir Contraseña</td>
                <td>
                  <input
                    type="password"
                    name="pass2"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit" className="registro-boton">
            Registrarse
          </button>
          <p className="registro-login">¿Ya tienes cuenta?</p>
          <a href="/cuenta">Iniciar sesión</a>
        </form>
      </div>
    </Base_Main>
  );
}


