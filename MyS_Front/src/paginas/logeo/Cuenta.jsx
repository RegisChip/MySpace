// MySpace\MyS_Front\src\paginas\logeo\Cuenta.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cuenta.css";
import { login } from "../../Api";
import Base_Main from "../../bases/Base_Main";

export default function CuentaPage() {

  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estado para mostrar errores específicos
  
  const logearUsuario = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Limpiar errores previos
    setLoading(true);
    
    try {
      console.log("Intentando login con:", { correo });
      
      // login() en Api.js ya guarda en localStorage con la estructura correcta
      const data = await login(correo, pass);
      
      console.log("Login exitoso:", data);
      
      alert(`¡Bienvenido ${data.usuario.nombre}!`);
      navigate("/perfil");
      
    } catch (error) {
      console.error("Error en login:", error);
      
      let message = "Error desconocido al iniciar sesión.";
      
      // Intentar parsear el error de Django
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.error) {
          message = errorData.error;
        } else if (errorData.correo) {
          message = Array.isArray(errorData.correo) ? errorData.correo[0] : errorData.correo;
        } else if (errorData.non_field_errors) {
          message = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors;
        } else {
          message = JSON.stringify(errorData);
        }
      } catch {
        message = error.message || "No se pudo conectar con el servidor.";
      }
      
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };
  
  const passOlvidada = (e) => {
    e.preventDefault();
    if (!correo) {
      alert("Ingresa tu correo para recuperar la contraseña");
    } else {
      alert(`Se ha enviado un correo de recuperación a ${correo}`);
    }
  };

  return (
    <Base_Main tituloPagina="Iniciar Sesión">
      <div className="cuenta-content">
        <form className="cuenta-form" onSubmit={logearUsuario}>
          <table>
            <tbody>
              <tr>
                <td>Correo</td>
                <td>
                  <input
                    type="email"
                    name="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={loading}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Contraseña</td>
                <td>
                  <input
                    type="password"
                    name="pass"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    disabled={loading}
                    required
                  />
                </td>
              </tr>
              {/* Mostrar el mensaje de error si existe */}
              {errorMsg && (
                  <tr>
                      <td colSpan="2" className="error-mensaje">
                        <span style={{ color: 'red', fontSize: '0.9em' }}>
                          {errorMsg}
                        </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <p><a href="#" onClick={passOlvidada}>¿Olvidaste tu contraseña?</a></p>
          <button type="submit" className="cuenta-btn" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          
          <p className="cuenta-login-text">¿Aún no tienes cuenta?</p>
          <Link to="/registro">Registrarse</Link>
        </form>
      </div>
    </Base_Main>
  );
}