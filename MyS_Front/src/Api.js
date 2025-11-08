// MySpace\MyS_Front\src\Api.js

const API_URL = "http://localhost/api"; // API de nginx

// Función helper para obtener el token
const getToken = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  return usuario?.tokens?.access || null;
};

// Función helper para manejar fetch con autenticación
async function handleFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  // Agregar token si existe
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al conectar con el backend");
  }
  return res.json();
}

// ==================== AUTENTICACIÓN ====================

export const login = async (correo, contrasena) => { // Inicio de Sesion

  console.log("=== LOGIN API LLAMADA ===");
  console.log("URL:", `${API_URL}/usuario/login/`);
  console.log("Datos:", { correo, contrasena });

  const data = await handleFetch("/usuario/login/", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });

  console.log("Respuesta del servidor:", data);
  
  // Guardar usuario en localStorage
  localStorage.setItem("usuarioLogeado", JSON.stringify(data));
  return data;
};

export const registro = async (userData) => { // Registro
  const data = await handleFetch("/usuario/registro/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  
  // Guardar usuario en localStorage
  localStorage.setItem("usuarioLogeado", JSON.stringify(data));
  return data;
};

export const logout = async () => { // Cerrar Sesion
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  
  if (usuario?.tokens?.refresh) {
    try {
      await handleFetch("/usuario/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: usuario.tokens.refresh }),
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
  
  localStorage.removeItem("usuarioLogeado");
};

// ==================== USUARIOS ====================

export const getUsuarios = () => handleFetch("/usuario/usuarios/");
export const getUsuarioPorId = (id) => handleFetch(`/usuario/usuarios/${id}/`);

export const getUsuarioPorCorreo = (correo) => 
  handleFetch(`/usuario/usuarios/por-correo/${correo}/`);

export const actualizarUsuario = (id, data) =>
  handleFetch(`/usuario/usuarios/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ==================== PERFILES ====================

export const getPerfiles = () => handleFetch("/usuario/perfiles/");
export const getPerfilPorId = (id) => handleFetch(`/usuario/perfiles/${id}/`);

export const getPerfilPorUsuario = (nomUsuario) =>
  handleFetch(`/usuario/perfiles/por-usuario/${nomUsuario}/`);

export const actualizarPerfil = (id, data) =>
  handleFetch(`/usuario/perfiles/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getSeguidoresPerfil = (perfilId) =>
  handleFetch(`/usuario/perfiles/${perfilId}/seguidores/`);

export const getSiguiendoPerfil = (perfilId) =>
  handleFetch(`/usuario/perfiles/${perfilId}/siguiendo/`);