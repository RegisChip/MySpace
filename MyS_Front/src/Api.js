// MySpace\MyS_Front\src\Api.js

const API_URL = "http://localhost/api"; // API de nginx

// ============================================
// HELPER FUNCTIONS
// ============================================

// Obtener el token del localStorage
const getToken = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
    return usuario?.tokens?.access || null;
  } catch (error) {
    console.error("Error al obtener token:", error);
    return null;
  }
};

// Verificar si el token está expirado
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return true;
  }
};

// Fetch CON autenticación (para operaciones protegidas)
async function fetchConAuth(url, options = {}) {
  const token = getToken();
  
  if (!token || isTokenExpired(token)) {
    throw new Error("No estás autenticado o tu sesión expiró");
  }
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };
  
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("usuarioLogeado");
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }
    const errorText = await res.text();
    throw new Error(errorText || "Error al conectar con el backend");
  }
  
  return res.json();
}

// Fetch SIN autenticación (para operaciones públicas)
async function fetchPublico(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
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


// ============================================
// AUTENTICACIÓN (PÚBLICO)
// ============================================

export const login = async (correo, contrasena) => {
  const data = await fetchPublico("/usuario/login/", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
  
  localStorage.setItem("usuarioLogeado", JSON.stringify(data));
  return data;
};

export const registro = async (userData) => {
  const data = await fetchPublico("/usuario/registro/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  
  localStorage.setItem("usuarioLogeado", JSON.stringify(data));
  return data;
};

export const logout = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  
  if (usuario?.tokens?.refresh) {
    try {
      await fetchConAuth("/usuario/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: usuario.tokens.refresh }),
      });
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    }
  }
  
  localStorage.removeItem("usuarioLogeado");
};


// ============================================
// USUARIOS (PÚBLICO - Solo lectura)
// ============================================

export const getUsuarios = () => fetchPublico("/usuario/usuarios/");

export const getUsuarioPorId = (id) => 
  fetchPublico(`/usuario/usuarios/${id}/`);

export const getUsuarioPorCorreo = (correo) => 
  fetchPublico(`/usuario/usuarios/por-correo/${correo}/`);

// REQUIERE AUTENTICACIÓN
export const actualizarUsuario = (id, data) =>
  fetchConAuth(`/usuario/usuarios/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ============================================
// PERFILES (PÚBLICO - Solo lectura)
// ============================================

export const getPerfiles = () => fetchPublico("/usuario/perfiles/");

export const getPerfilPorId = (id) => 
  fetchPublico(`/usuario/perfiles/${id}/`);

export const getPerfilPorUsuario = (nomUsuario) =>
  fetchPublico(`/usuario/perfiles/por-usuario/${nomUsuario}/`);

export const getSeguidoresPerfil = (perfilId) =>
  fetchPublico(`/usuario/perfiles/${perfilId}/seguidores/`);

export const getSiguiendoPerfil = (perfilId) =>
  fetchPublico(`/usuario/perfiles/${perfilId}/siguiendo/`);

// REQUIERE AUTENTICACIÓN - Ver tu propio perfil
export const getMiPerfil = () =>
  fetchConAuth("/usuario/perfiles/mi_perfil/");

// REQUIERE AUTENTICACIÓN - Actualizar perfil
export const actualizarPerfil = (id, data) =>
  fetchConAuth(`/usuario/perfiles/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// ============================================
// PUBLICACIONES (PÚBLICO - Solo lectura)
// ============================================

export const getPublicaciones = () => 
  fetchPublico("/publicaciones/publicaciones/");

export const getPublicacionesPorPerfil = (perfilId) => 
  fetchPublico(`/publicaciones/publicaciones/por-perfil/${perfilId}/`);

export const getFeedPublicaciones = (perfilId = null) => {
  const url = perfilId 
    ? `/publicaciones/publicaciones/feed/?perfil_id=${perfilId}`
    : "/publicaciones/publicaciones/feed/";
  return fetchPublico(url);
};

// REQUIERE AUTENTICACIÓN - Crear publicación
export const crearPublicacion = (data) =>
  fetchConAuth("/publicaciones/publicaciones/", {
    method: "POST",
    body: JSON.stringify(data),
  });

// REQUIERE AUTENTICACIÓN - Dar/quitar like
export const darLikePublicacion = (publicacionId) =>
  fetchConAuth(`/publicaciones/publicaciones/${publicacionId}/dar_like/`, {
    method: "POST",
  });

export const quitarLikePublicacion = (publicacionId) =>
  fetchConAuth(`/publicaciones/publicaciones/${publicacionId}/quitar_like/`, {
    method: "POST",
  });

// ============================================
// COMENTARIOS (PÚBLICO - Solo lectura)
// ============================================

export const getComentariosPorPublicacion = (publicacionId) =>
  fetchPublico(`/publicaciones/comentarios/por-publicacion/${publicacionId}/`);

// REQUIERE AUTENTICACIÓN - Crear comentario
export const crearComentario = (data) =>
  fetchConAuth("/publicaciones/comentarios/", {
    method: "POST",
    body: JSON.stringify(data),
  });

// REQUIERE AUTENTICACIÓN - Dar/quitar like
export const darLikeComentario = (comentarioId) =>
  fetchConAuth(`/publicaciones/comentarios/${comentarioId}/dar_like/`, {
    method: "POST",
  });

export const quitarLikeComentario = (comentarioId) =>
  fetchConAuth(`/publicaciones/comentarios/${comentarioId}/quitar_like/`, {
    method: "POST",
  });

// ============================================
// UTILIDADES
// ============================================

export const estaAutenticado = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

export const getUsuarioActual = () => {
  try {
    return JSON.parse(localStorage.getItem("usuarioLogeado"));
  } catch {
    return null;
  }
};