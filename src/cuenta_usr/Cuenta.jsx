import React, { useState } from "react";
import "./Cuenta.css";
import { Link, useNavigate } from "react-router-dom";
import perfilData from "../data/perfilData";


export default function CuentaPage() {

  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (correo === perfilData.correo && pass === perfilData.password) {
      // Guarda el usuario en localStorage si quieres mantener la sesión
      localStorage.setItem("usuarioLogeado", JSON.stringify(perfilData));

      alert(`¡Bienvenido ${perfilData.nombre}!`);
      navigate("/perfil");
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };


  const handleOlvide = () => {
    if (!correo) {
      alert("Ingresa tu correo para recuperar la contraseña");
    } else {
      alert(`Se ha enviado un correo de recuperación a ${correo}`);
    }
  };



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
          <form className="cuenta-form" onSubmit={handleLogin}>
            <table>
              <tbody>
                <tr>
                  <td>Correo</td>
                  <td>
                    <input type="email" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                  </td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td>
                    <input type="password" name="pass" value={pass} onChange={(e) => setPass(e.target.value)} required />
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              <a href="#" onClick={handleOlvide}>¿Olvidaste tu contraseña?</a>
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
