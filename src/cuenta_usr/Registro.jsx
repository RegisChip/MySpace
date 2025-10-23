import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apaterno, setApaterno] = useState("");
  const [amaterno, setAmaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const handleRegistro = (e) => {
    e.preventDefault();
    if (pass1 !== pass2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find((u) => u.correo === correo);
    if (existe) {
      alert("Este correo ya está registrado");
      return;
    }

    const nuevoUsuario = { nombre, apaterno, amaterno, correo, pass: pass1 };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario registrado correctamente");
    navigate("/cuenta");
  };

  return (
    <div className="registro-grid">
      <header id="registro-header">
        <h1><a href="/">MySpace</a></h1>
        <p>Registro</p>
      </header>

      <main id="registro-main">
        <div className="registro-content">
          <form className="registro-form" onSubmit={handleRegistro}>
            <table>
              <tbody>
                <tr>
                  <td>Nombre</td>
                  <td><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Apellido Paterno</td>
                  <td><input type="text" value={apaterno} onChange={(e) => setApaterno(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Apellido Materno</td>
                  <td><input type="text" value={amaterno} onChange={(e) => setAmaterno(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Correo</td>
                  <td><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td><input type="password" value={pass1} onChange={(e) => setPass1(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Repetir Contraseña</td>
                  <td><input type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} required /></td>
                </tr>
              </tbody>
            </table>

            <button type="submit" className="registro-btn">Registrarse</button>
          </form>
        </div>
      </main>
    </div>
  );
}
