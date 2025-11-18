// MySpace\MyS_Front\src\api\Validaciones.js

import axios from 'axios';

const BASE_URL = "/api/cuenta_usr/"; 

/* Llama a la API de Django para verificar la disponibilidad del correo (AJAX) */
export const validarEmail = async (correo) => {
    try {
        const response = await axios.post(`${BASE_URL}validar/email/`, { correo });
        return response.data; 
    } catch (error) {
        console.error("Error al validar email:", error);
        throw new Error("Error de conexión al validar el correo.");
    }
};

/* Llama a la API de Django para verificar la unicidad del nombre completo (AJAX) */
export const validarNombreCompleto = async (nombre, apellido_p, apellido_m) => {
    try {
        const response = await axios.post(`${BASE_URL}validar/nombre-completo/`, { nombre, apellido_p, apellido_m });
        return response.data; 
    } catch (error) {
        console.error("Error al validar nombre completo:", error);
        throw new Error("Error de conexión al validar el nombre completo.");
    }
};