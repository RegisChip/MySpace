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
    localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario)); // Guardar usuario actual
    alert("Usuario registrado correctamente");
    navigate("/cuenta");
  };



  return (
    <div className="registro-grid">
      {/* HEADER */}
      <header id="registro-header">
        <h1><a href="/">MySpace</a></h1>
        <p>Editar</p>
      </header>

      {/* MAIN */}
      <main id="registro-main">
        <div className="registro-content">
          <form className="registro-form" onSubmit={handleRegistro}>
            <table>
              <tbody>
                <tr>
                  <td>Nombre</td>
                  <td><input type="text" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required/></td>
                </tr>
                <tr>
                  <td>Apellido Paterno</td>
                  <td><input type="text" name="apaterno" value={apaterno} onChange={(e) => setApaterno(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Apellido Materno</td>
                  <td><input type="text" name="amaterno" value={amaterno} onChange={(e) => setAmaterno(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Correo</td>
                  <td><input type="email" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td><input type="password" name="pass1" value={pass1} onChange={(e) => setPass1(e.target.value)} required  /></td>
                </tr>
                <tr>
                  <td>Repetir Contraseña</td>
                  <td><input type="password" name="pass2" value={pass2} onChange={(e) => setPass2(e.target.value)} required /></td>
                </tr>
              </tbody>
            </table>

            <button type="submit" className="registro-btn">Registrarse</button>
            <p className="registro-login">¿Ya tienes cuenta?</p>
            <a href="/cuenta">Iniciar sesión</a>
          </form>
        </div>

        {/* MAIN FOOTER */}
        <footer id="registro-main-foot">
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

      {/* BASE FOOTER */}
      <footer id="registro-foot">
        <ul>
          <li><a href="#">Acerca de</a> |</li>
          <li><a href="#">Reglas</a> |</li>
          <li><a href="#">Términos y condiciones</a> |</li>
          <li><a href="#">Privacidad</a> |</li>
          <li><a href="#">Contacto</a></li>
        </ul>
        <p>©2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
