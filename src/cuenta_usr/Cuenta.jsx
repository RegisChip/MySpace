import React from "react";
import "./Cuenta.css";
import { Link } from "react-router-dom";

export default function CuentaPage() {
  return (
    <div className="cuenta-grid">
      {/* HEADER */}
      <header id="cuenta-header">
        <h1>
          <a href="/" onClick={() => window.location.reload()}>MySpace</a>
        </h1>
        <p>Iniciar Sesión</p>
      </header>

      {/* MAIN */}
      <main id="cuenta-main">
        <div className="cuenta-content">
          <form className="cuenta-form">
            <table>
              <tbody>
                <tr>
                  <td>Correo</td>
                  <td>
                    <input type="email" name="correo" required />
                  </td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td>
                    <input type="password" name="pass" required />
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              <a href="#">¿Olvidaste tu contraseña?</a>
            </p>
            <button type="submit" className="cuenta-btn">Iniciar Sesión</button>
            <p className="cuenta-login-text">¿Aún no tienes cuenta?</p>
            <Link to="/registro">Registrarse</Link>
          </form>
        </div>

        <footer id="cuenta-main-foot">
          <p>
            <a href="https://validator.w3.org/#validate_by_input" target="_blank" rel="noreferrer">
              <img
                style={{ border: 0, width: 88, height: 31 }}
                src="/w3c-html.png"
                alt="Valid HTML!"
              />
            </a>
          </p>
          <p>
            <a href="https://jigsaw.w3.org/css-validator/#validate_by_input" target="_blank" rel="noreferrer">
              <img
                style={{ border: 0, width: 88, height: 31 }}
                src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
                alt="Valid CSS!"
              />
            </a>
          </p>
        </footer>
      </main>

      {/* FOOTER BASE */}
      <footer id="cuenta-footer">
        <ul>
          <li><a href="#">Acerca de</a> |</li>
          <li><a href="#">Reglas</a> |</li>
          <li><a href="#">Términos y condiciones</a> |</li>
          <li><a href="#">Privacidad</a> |</li>
          <li><a href="#">Contacto</a></li>
        </ul>
        <p>&copy;2025 - MySpace.com Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
