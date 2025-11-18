// MySpace\MyS_Front\src\Api.js

const API_URL = window.location.hostname === "localhost"
  ? "https://localhost/api"
  : `https://${window.location.hostname}/api`;
  // Se utiliza https en localhost para simular un entorno seguro

// Mensajes para la consola del navegador
console.log("[DESARROLLO] API_URL configurada:", API_URL);
console.log("Modo HTTPS activado");

//=================================================================================

// ==================
//  FUNCIONES HELPER
// ==================

// Uso de token para la autenticacion del usuario
const getToken = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
    const token = usuario?.tokens?.access || null;
    // Mensajes para la consola del navegador: verificar token y usuario
    console.log("Token recuperado:", token ? "Existe" : "No existe");
    console.log("Usuario completo:", usuario); 
    return token;
  } catch (error) {
    console.error("Error al obtener token:", error);
    return null;
  }
};


// Verificacion del estado del token (si es qu esta expirado)
const isTokenExpired = (token) => {
  if (!token) {
    console.warn("No hay token para verificar");
    return true;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    const timeLeft = (exp - now) / 1000 / 60;
    // Mensajes para la consola del navegador: tiempo restante del token
    console.log(`El Token expira en: ${timeLeft.toFixed(2)} minutos`);
    return now >= exp;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return true;
  }
};

// ======================================================
//  FUNCION PRINCIPAL PARA PETICIONES CON AUTENTICACION
// ======================================================

async function fetchConAuth(url, options = {}) {
  const token = getToken();
  // Mensajes para la consola del navegador: verificar si existe el token
  console.log("Verificando autenticación...");
  console.log("Token existe:", !!token);
  console.log("Token expirado:", token ? isTokenExpired(token) : "N/A");
  if (!token) {
    console.error("No hay token disponible");
    throw new Error("No estás autenticado o tu sesión expiró");
  }
  if (isTokenExpired(token)) {
    console.error("Token expirado");
    localStorage.removeItem("usuarioLogeado");
    throw new Error("No estás autenticado o tu sesión expiró");
  }
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };
  // Mensajes para la consola del navegador: detalles de la peticion
  console.log(`[AUTH] ${options.method || 'GET'} ${API_URL}${url}`);
  console.log("Headers:", headers);
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  // Mensajes para la consola del navegador: resultado de la peticion
  console.log(`Status: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    if (res.status === 401) {
      console.error("Backend rechazó el token (401)");
      localStorage.removeItem("usuarioLogeado");
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }
    const errorText = await res.text();
    console.error("Error respuesta:", errorText);
    throw new Error(errorText || "Error al conectar con el backend");
  }
  // Mensajes para la consola del navegador: respuesta
  console.log("Petición exitosa");
  return res.json();
};

// =============================================
// FUNCION PRINCIPAL PARA PETICIONES PUBLICAS 
// =============================================

async function fetchPublico(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  // Mensajes para la consola del navegador: detalles de la peticion
  console.log(`[PÚBLICO] ${options.method || 'GET'} ${API_URL}${url}`);
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text();
    // Mensajes para la consola del navegador: resultado de la peticion
    console.error("Error respuesta:", errorText);
    throw new Error(errorText || "Error al conectar con el backend");
  }
  return res.json();
};

//=================================================================================

// ================================================================================
//  RECUPERACION DE LOS DATOS ENVIADOS DESDE EL BACKEND (USUARIOS Y PUBLICACIONES)
// ================================================================================

// =======================
// AUTENTICACIÓN PÚBLICA
// =======================

export const registro = async (userData) => { // Registro del usuario
  const data = await fetchPublico("/usuario/registro/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  const usuarioLogeado = {
    usuario: data.usuario,
    perfil: {
      id: data.perfil?.id,
      nom_usuario: data.perfil?.nom_usuario,
      foto_perfil: data.perfil?.foto_perfil,
      descripcion: data.perfil?.descripcion,
      usuario: data.perfil?.usuario
    },
    tokens: {
      access: data.tokens?.access,
      refresh: data.tokens?.refresh
    }
  };
  // Mensajes para la consola del navegador: usuario registrado a la BD
  console.log("Guardando usuario:", usuarioLogeado);
  localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
  return data;
};


export const login = async (correo, contrasena) => { // Inicio de Sesion
  const data = await fetchPublico("/usuario/login/", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
  const usuarioLogeado = {
    usuario: data.usuario,
    perfil: {
      id: data.perfil?.id,
      nom_usuario: data.perfil?.nom_usuario,
      foto_perfil: data.perfil?.foto_perfil,
      descripcion: data.perfil?.descripcion,
      usuario: data.perfil?.usuario
    },
    tokens: {
      access: data.tokens?.access,
      refresh: data.tokens?.refresh
    }
  };
  // Mensajes para la consola del navegador: usuario guardado al iniciar sesion
  console.log("Guardando usuario:", usuarioLogeado);
  localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
  return data;
};


export const logout = async () => { // Cierre de Sesion
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  if (usuario?.tokens?.refresh) {
    try {
      await fetchConAuth("/usuario/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: usuario.tokens.refresh }),
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
  // Mensajes para la consola del navegador: usuario eliminado al cerrar sesion
  console.log("Eliminando usuario logeado");
  localStorage.removeItem("usuarioLogeado");
};

// ====================
//  VALIDACIONES AJAX 
// ====================

export const validarEmail = async (correo) => { // Validacion del email
  try {
    const data = await fetchPublico("/usuario/validar/email/", {
      method: "POST",
      body: JSON.stringify({ correo }),
    });
    return data;
  } catch (error) {
    // Mensajes para la consola del navegador: error de validacion
    console.error("Error al validar email:", error);
    throw new Error("Error de conexión al validar el correo.");
  }
};


export const validarNombreCompleto = async (nombre, apellido_p, apellido_m) => { // Validacion del nombre completo
  try {
    const data = await fetchPublico("/usuario/validar/nombre-completo/", {
      method: "POST",
      body: JSON.stringify({ nombre, apellido_p, apellido_m }),
    });
    return data;
  } catch (error) {
    // Mensajes para la consola del navegador: error de validacion
    console.error("Error al validar nombre completo:", error);
    throw new Error("Error de conexión al validar el nombre completo.");
  }
};

// ================================
// CONTENIDO PÚBLICO (Solo lectura)
// ================================

// ====== USUARIOS ======
export const getUsuarios = () => fetchPublico("/usuario/usuarios/");
export const getUsuarioPorId = (id) => 
  fetchPublico(`/usuario/usuarios/${id}/`);
export const getUsuarioPorCorreo = (correo) => 
  fetchPublico(`/usuario/usuarios/por-correo/${correo}/`);
export const actualizarUsuario = (id, data) =>
  fetchConAuth(`/usuario/usuarios/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ====== PERFILES ======
export const getPerfiles = () => fetchPublico("/usuario/perfiles/");
export const getPerfilPorId = (id) => 
  fetchPublico(`/usuario/perfiles/${id}/`);
export const getPerfilPorUsuario = (nomUsuario) =>
  fetchPublico(`/usuario/perfiles/por-usuario/${nomUsuario}/`);
export const getSeguidoresPerfil = (perfilId) =>
  fetchPublico(`/usuario/perfiles/${perfilId}/seguidores/`);
export const getSiguiendoPerfil = (perfilId) =>
  fetchPublico(`/usuario/perfiles/${perfilId}/siguiendo/`);
export const getMiPerfil = () =>
  fetchConAuth("/usuario/perfiles/mi_perfil/");
export const actualizarPerfil = (id, data) =>
  fetchConAuth(`/usuario/perfiles/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// ====== PUBLICACIONES ======
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

export const crearPublicacion = (data) => {
  const payload = {
    texto: data.content || data.texto,
    perfil: Number(data.perfil),
    fotos_rutas: data.image ? [data.image] : []
  };
  // Mensajes para la consola del navegador: verificacion del payload (JSON)
  console.log("Payload publicación:", payload);
  return fetchConAuth("/publicaciones/publicaciones/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const darLikePublicacion = (publicacionId) =>
  fetchConAuth(`/publicaciones/publicaciones/${publicacionId}/dar_like/`, {
    method: "POST",
  });
export const quitarLikePublicacion = (publicacionId) =>
  fetchConAuth(`/publicaciones/publicaciones/${publicacionId}/quitar_like/`, {
    method: "POST",
  });

// ====== COMENTARIOS ======
export const getComentariosPorPublicacion = (publicacionId) =>
  fetchPublico(`/publicaciones/comentarios/por-publicacion/${publicacionId}/`);
export const getComentariosPorPerfil = (perfilId) =>
  fetchPublico(`/publicaciones/comentarios/por-perfil/${perfilId}/`);

export const crearComentario = (data) => {
  const payload = {
    texto: data.texto,
    perfil: Number(data.perfil),
    publicacion: Number(data.publicacion)
  };
  // Mensajes para la consola del navegador: verificacion del payload (JSON)
  console.log("Payload comentario:", payload);
  return fetchConAuth("/publicaciones/comentarios/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const darLikeComentario = (comentarioId) =>
  fetchConAuth(`/publicaciones/comentarios/${comentarioId}/dar_like/`, {
    method: "POST",
  });
export const quitarLikeComentario = (comentarioId) =>
  fetchConAuth(`/publicaciones/comentarios/${comentarioId}/quitar_like/`, {
    method: "POST",
  });


// =============
//  UTILIDADES
// =============

export const estaAutenticado = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

export const getUsuarioActual = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
    if (!usuario || !usuario.perfil || !usuario.perfil.id) {
      // Mensajes para la consola del navegador: verifica el perfil del usuario
      console.warn("Usuario sin perfil válido");
      return null;
    }
    // Mensajes para la consola del navegador: verificacion del usuario actual
    console.log("Usuario recuperado:", usuario);
    return usuario;
  } catch {
    console.warn("No se pudo recuperar usuario");
    return null;
  }
};