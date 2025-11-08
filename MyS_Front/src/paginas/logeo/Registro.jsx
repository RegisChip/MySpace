// MySpace\MyS_Front\src\paginas\logeo\Registro.jsx

// YA ES FUNCIONAL

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";
import { registro } from "../../Api";

// importe de la base
import Base_Main from "../../bases/Base_Main"; 

export default function Registro() {
  
  const navigate = useNavigate();

  // Estados
  const [nombre, setNombre] = useState("");
  const [apPaterno, setApPaterno] = useState("");
  const [apMaterno, setApMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarUsuario = async (e) => {

    e.preventDefault();
    
    console.log("=== INICIO REGISTRO ===");

    // Validar contraseñas
    if (pass1 !== pass2) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    if (pass1.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    if (!fechaNacimiento) {
      alert("Por favor ingresa tu fecha de nacimiento");
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar al backend
      const userData = {
        nombre: nombre,
        apellido_p: apPaterno,
        apellido_m: apMaterno,
        correo: correo,
        contrasena: pass1,
        fecha_nacimiento: new Date(fechaNacimiento).toISOString(),
        // Datos del perfil - usando nombre como nombre de usuario
        nom_usuario: nombre.toLowerCase().replace(/\s+/g, ''),
        descripcion: "",
        foto_perfil: ""
      };
      
      console.log("Enviando datos:", userData);
      
      const data = await registro(userData);
      
      console.log("Registro exitoso:", data);
      
      alert(`¡Bienvenido ${data.usuario.nombre}! Tu cuenta ha sido creada.`);
      navigate("/perfil");
      
    } catch (error) {
      console.error("Error en registro:", error);
      
      // Intentar parsear el error para mostrar mensaje específico
      let errorMsg = "Error al registrar usuario";
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.correo) {
          errorMsg = "Este correo ya está registrado";
        } else if (errorData.nom_usuario) {
          errorMsg = "Este nombre de usuario ya está en uso";
        } else {
          errorMsg = JSON.stringify(errorData);
        }
      } catch {
        errorMsg = error.message;
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }

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
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              <tr>
                <td>Apellido Paterno</td>
                <td>
                  <input
                    type="text"
                    value={apPaterno}
                    onChange={(e) => setApPaterno(e.target.value)}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              <tr>
                <td>Apellido Materno</td>
                <td>
                  <input
                    type="text"
                    value={apMaterno}
                    onChange={(e) => setApMaterno(e.target.value)}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              <tr>
                <td>Correo</td>
                <td>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              <tr>
                <td>Fecha de Nacimiento</td>
                <td>
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    required
                    disabled={loading}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </td>
              </tr>
              <tr>
                <td>Contraseña</td>
                <td>
                  <input
                    type="password"
                    value={pass1}
                    onChange={(e) => setPass1(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </td>
              </tr>
              <tr>
                <td>Repetir Contraseña</td>
                <td>
                  <input
                    type="password"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button 
          type="submit" 
          className="registro-boton"
          disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="registro-login">¿Ya tienes cuenta?</p>
          <a href="/cuenta">Iniciar sesión</a>
        </form>
      </div>
    </Base_Main>
  );
}


