// MySpace\MyS_Front\src\paginas\logeo\Registro.jsx

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";
import { registro, validarEmail, validarNombreCompleto } from "../../Api";
import Base_Main from "../../bases/Base_Main";

export default function Registro() {

  const navigate = useNavigate();

  // ===== ESTADOS DEL FORMULARIO =====
  const [nombre, setNombre] = useState("");
  const [apPaterno, setApPaterno] = useState("");
  const [apMaterno, setApMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  
  // ===== ESTADOS DE VALIDACIÓN AJAX =====
  const [emailStatus, setEmailStatus] = useState({ mensaje: "", tipo: "" });
  const [nombreStatus, setNombreStatus] = useState({ mensaje: "", tipo: "" });
  
  // ===== ESTADO DE LOADING =====
  const [loading, setLoading] = useState(false);
  
  // ===== REFERENCIAS PARA DEBOUNCING =====
  const timeoutEmailRef = useRef(null);
  const timeoutNombreRef = useRef(null);

  // ===== CLEANUP AL DESMONTAR =====
  useEffect(() => {
    return () => {
      if (timeoutEmailRef.current) clearTimeout(timeoutEmailRef.current);
      if (timeoutNombreRef.current) clearTimeout(timeoutNombreRef.current);
    };
  }, []);

  // ========================================
  // VALIDACIÓN AJAX: EMAIL EN TIEMPO REAL
  // ========================================
  const validarEmailEnTiempoReal = useCallback(async (email) => {
    if (timeoutEmailRef.current) {
      clearTimeout(timeoutEmailRef.current);
    }
    if (!email || email.trim() === "") {
      setEmailStatus({ mensaje: "", tipo: "" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus({ mensaje: "Formato de correo inválido", tipo: "error" });
      return;
    }

    // Mostrar estado de validación
    setEmailStatus({ mensaje: "Validando...", tipo: "validando" });

    // Debouncing: Esperar 600ms
    timeoutEmailRef.current = setTimeout(async () => {
      try {
        const response = await validarEmail(email);
        
        // USAR "existe" EN LUGAR DE "disponible"
        if (response.existe) {
          setEmailStatus({ 
            mensaje: "Este correo ya está registrado", 
            tipo: "error" 
          });
        } else {
          setEmailStatus({ 
            mensaje: "Correo disponible", 
            tipo: "success" 
          });
        }
      } catch (error) {
        console.error("Error validando email:", error);
        setEmailStatus({ 
          mensaje: "Error al validar correo", 
          tipo: "error" 
        });
      }
    }, 600);
  }, []);

  // ================================================
  // VALIDACIÓN AJAX: NOMBRE COMPLETO EN TIEMPO REAL
  // ================================================
  const validarNombreEnTiempoReal = useCallback(async (nom, apP, apM) => {
    // Limpiar timeout anterior
    if (timeoutNombreRef.current) {
      clearTimeout(timeoutNombreRef.current);
    }
    // Validar que los tres campos tengan contenido
    if (!nom || !apP || !apM) {
      setNombreStatus({ mensaje: "", tipo: "" });
      return;
    }

    // Mostrar estado de validación
    setNombreStatus({ mensaje: "Verificando disponibilidad...", tipo: "validando" });

    // Debouncing: Esperar 800ms
    timeoutNombreRef.current = setTimeout(async () => {
      try {
        const response = await validarNombreCompleto(nom, apP, apM);
        
        // USAR "existe" EN LUGAR DE "disponible"
        if (response.existe) {
          setNombreStatus({ 
            mensaje: "Ya existe un usuario con este nombre completo", 
            tipo: "error" 
          });
        } else {
          setNombreStatus({ mensaje: "", tipo: "" });
        }
      } catch (error) {
        console.error("Error validando nombre completo:", error);
        setNombreStatus({ mensaje: "", tipo: "" });
      }
    }, 800);
  }, []);

  // ========================================
  // REGISTRO AJAX: ENVÍO DEL FORMULARIO
  // ========================================
  const registrarUsuario = async (e) => {
    e.preventDefault(); // Previene recarga de página
    
    console.log("INICIO REGISTRO");
    
    // Verificar errores de validación
    if (emailStatus.tipo === "error" || nombreStatus.tipo === "error") {
      alert("Por favor corrige los errores en el formulario");
      return;
    }
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
      // PREPARAR DATOS
      const userData = {
        nombre: nombre.trim(),
        apellido_p: apPaterno.trim(),
        apellido_m: apMaterno.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena: pass1,
        fecha_nacimiento: new Date(fechaNacimiento).toISOString(),
        nom_usuario: nombre.toLowerCase().replace(/\s+/g, ''),
        descripcion: "",
        foto_perfil: ""
      };
      
      console.log("Enviando datos:", userData);
      
      // registro() en Api.js ya guarda en localStorage con la estructura correcta
      const data = await registro(userData);
      
      console.log("Registro exitoso:", data);
      
      // ===== NOTA: registro() ya guarda en localStorage =====
      // localStorage.setItem("usuarioLogeado", JSON.stringify(data));
      
      alert(`¡Bienvenido ${data.usuario.nombre}! Tu cuenta ha sido creada.`);
      navigate("/perfil");
      
    } catch (error) {
      console.error("Error en registro:", error);
      
      // MANEJO DE ERRORES
      let errorMsg = "Error al registrar usuario";
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.correo) {
          errorMsg = Array.isArray(errorData.correo) ? errorData.correo[0] : "Este correo ya está registrado";
        } else if (errorData.nom_usuario) {
          errorMsg = "Este nombre de usuario ya está en uso";
        } else if (errorData.error) {
          errorMsg = errorData.error;
        } else {
          errorMsg = JSON.stringify(errorData);
        }
      } catch {
        errorMsg = error.message || "Error de conexión";
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // HANDLERS DE CAMBIO CON VALIDACIÓN
  // ========================================
  
  const handleCorreoChange = (e) => {
    const nuevoCorreo = e.target.value;
    setCorreo(nuevoCorreo);
    validarEmailEnTiempoReal(nuevoCorreo);
  };
  
  const handleNombreChange = (e) => {
    const nuevoNombre = e.target.value;
    setNombre(nuevoNombre);
    validarNombreEnTiempoReal(nuevoNombre, apPaterno, apMaterno);
  };
  
  const handleApPaternoChange = (e) => {
    const nuevoApPaterno = e.target.value;
    setApPaterno(nuevoApPaterno);
    validarNombreEnTiempoReal(nombre, nuevoApPaterno, apMaterno);
  };
  
  const handleApMaternoChange = (e) => {
    const nuevoApMaterno = e.target.value;
    setApMaterno(nuevoApMaterno);
    validarNombreEnTiempoReal(nombre, apPaterno, nuevoApMaterno);
  };

  // ========================================
  // FUNCIÓN HELPER PARA ESTILOS
  // ========================================
  const getStatusClass = (status) => {
    if (status.tipo === "success") return "status-success";
    if (status.tipo === "error") return "status-error";
    if (status.tipo === "validando") return "status-validando";
    return "";
  };

  return (
    <Base_Main tituloPagina="Registro">
      <div className="registro-contenido">
        <form className="registro-forma" onSubmit={registrarUsuario}>
          <table>
            <tbody>
              {/* ===== NOMBRE ===== */}
              <tr>
                <td>Nombre</td>
                <td>
                  <input
                    type="text"
                    value={nombre}
                    onChange={handleNombreChange}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              
              {/* ===== APELLIDO PATERNO ===== */}
              <tr>
                <td>Apellido Paterno</td>
                <td>
                  <input
                    type="text"
                    value={apPaterno}
                    onChange={handleApPaternoChange}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              
              {/* ===== APELLIDO MATERNO ===== */}
              <tr>
                <td>Apellido Materno</td>
                <td>
                  <input
                    type="text"
                    value={apMaterno}
                    onChange={handleApMaternoChange}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              
              {/* ===== MENSAJE DE VALIDACIÓN NOMBRE ===== */}
              {nombreStatus.mensaje && (
                <tr>
                  <td colSpan="2">
                    <span className={`status-mensaje ${getStatusClass(nombreStatus)}`}>
                      {nombreStatus.tipo === "validando"}
                      {nombreStatus.tipo === "error"}
                      {nombreStatus.mensaje}
                    </span>
                  </td>
                </tr>
              )}
              
              {/* ===== CORREO ===== */}
              <tr>
                <td>Correo</td>
                <td>
                  <input
                    type="email"
                    value={correo}
                    onChange={handleCorreoChange}
                    required
                    disabled={loading}
                  />
                </td>
              </tr>
              
              {/* ===== MENSAJE DE VALIDACIÓN EMAIL ===== */}
              {emailStatus.mensaje && (
                <tr>
                  <td colSpan="2">
                    <span className={`status-mensaje ${getStatusClass(emailStatus)}`}>
                      {emailStatus.tipo === "validando"}
                      {emailStatus.tipo === "error"}
                      {emailStatus.tipo === "success"}
                      {emailStatus.mensaje}
                    </span>
                  </td>
                </tr>
              )}
              
              {/* ===== FECHA DE NACIMIENTO ===== */}
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
              
              {/* ===== CONTRASEÑA ===== */}
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
              
              {/* ===== REPETIR CONTRASEÑA ===== */}
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
            disabled={loading || emailStatus.tipo === "validando" || nombreStatus.tipo === "validando"}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="registro-login">¿Ya tienes cuenta?</p>
          <a href="/cuenta">Iniciar sesión</a>
        </form>
      </div>
    </Base_Main>
  );
}