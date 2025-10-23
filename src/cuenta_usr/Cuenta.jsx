import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cuenta.css";

export default function CuentaPage() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find((u) => u.correo === correo && u.pass === pass);

    if (usuario) {
      localStorage.setItem("usuarioLogeado", JSON.stringify(usuario));
      alert(`¡Bienvenido ${usuario.nombre}!`);
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
      <header id="cuenta-header">
        <h1><a href="/" onClick={() => window.location.reload()}>MySpace</a></h1>
        <p>Iniciar Sesión</p>
      </header>

      <main id="cuenta-main">
        <div className="cuenta-content">
          <form className="cuenta-form" onSubmit={handleLogin}>
            <table>
              <tbody>
                <tr>
                  <td>Correo</td>
                  <td><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td>Contraseña</td>
                  <td><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required /></td>
                </tr>
              </tbody>
            </table>

            <p><a href="#" onClick={handleOlvide}>¿Olvidaste tu contraseña?</a></p>
            <button type="submit" className="cuenta-btn">Iniciar Sesión</button>
            <p className="cuenta-login-text">¿Aún no tienes cuenta?</p>
            <Link to="/registro">Registrarse</Link>
          </form>
        </div>
      </main>
    </div>
  );
}
