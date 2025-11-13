// MySpace\MyS_Front\src\paginas\logeo\Cuenta.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cuenta.css";
import { login } from "../../Api"; // Asumo que esta es la función que llama a tu API de Django
import Base_Main from "../../bases/Base_Main";

export default function CuentaPage() {
  
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(''); // Estado para mostrar errores específicos
  
  const logearUsuario = async (e) => {
    e.preventDefault();
        setErrorMsg(''); // Limpiar errores previos
    setLoading(true);
    
    try {
      // 1. Llamada AJAX al backend
      const data = await login(correo, pass);
      console.log("Login exitoso:", data);
      
      // 2. Guardar la información del usuario en localStorage
      const usuarioLogeado = {
        correo: data.usuario.correo,
        nombre: data.usuario.nombre,
        apellido_p: data.usuario.apellido_p,
        apellido_m: data.usuario.apellido_m,
        fecha_nacimiento: data.usuario.fecha_nacimiento,
        // Datos del perfil
        nom_usuario: data.perfil?.nom_usuario || data.usuario.nombre,
        descripcion: data.perfil?.descripcion || "",
        imagen: data.perfil?.foto_perfil || "https://via.placeholder.com/150"
      };
      
      localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
      
      alert(`¡Bienvenido ${data.usuario.nombre}!`);
      navigate("/perfil");
      
    } catch (error) {
      console.error("Error en login:", error);
            
            // 🚨 Manejo de errores mejorado basado en la respuesta de Django/Axios
            let message = "Error desconocido al iniciar sesión.";
            
            if (error.response) {
                const errorData = error.response.data;
                // Si la vista de login de Django retorna el error 'error'
                if (errorData.error) {
                    message = errorData.error; // Ej: "Correo o contraseña incorrectos"
                } 
                // Si el Serializer de Login falla, puede retornar errores de campo
                else if (errorData.correo) { 
                    message = errorData.correo[0]; // Ej: "Correo no registrado"
                } 
                else if (errorData.non_field_errors) {
                    message = errorData.non_field_errors[0];
                }
            } else {
                message = "No se pudo conectar con el servidor.";
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
                                        <span style={{ color: 'red', fontSize: '0.9em' }}>{errorMsg}</span>
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