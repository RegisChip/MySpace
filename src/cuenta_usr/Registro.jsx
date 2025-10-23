import React from "react";
import "./Registro.css";

export default function Registro() {
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
          <form className="registro-form">
            <table>
              <tbody>
                <tr>
                  <td>Nombre</td>
                  <td><input type="text" name="nombre" required /></td>
                </tr>
                <tr>
                  <td>Apellido Paterno</td>
                  <td><input type="text" name="apaterno" required /></td>
                </tr>
                <tr>
                  <td>Apellido Materno</td>
                  <td><input type="text" name="amaterno" required /></td>
                </tr>
                <tr>
                  <td>Correo</td>
                  <td><input type="email" name="correo" required /></td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td><input type="password" name="pass1" required /></td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td><input type="password" name="pass2" required /></td>
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
