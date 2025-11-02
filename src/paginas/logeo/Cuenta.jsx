// src/paginas/logeo/Cuenta.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import perfilData from "../../data/perfilData";
import "./Cuenta.css";

// importe de la base
import Base_Main from "../../bases/Base_Main";

export default function CuentaPage() {
    
    const navigate = useNavigate();

    //Datos del uauario
    const [correo, setCorreo] = useState("");
    const [pass, setPass] = useState("");
    const usuarios = perfilData;
    
    const logearUsuario = (e) => {
        e.preventDefault();
        const usuario = usuarios.find((u) => u.correo === correo && u.password === pass);
        if (usuario) {
            localStorage.setItem("usuarioLogeado", JSON.stringify(usuario));
            alert(`¡Bienvenido ${usuario.nombre}!`);
            navigate("/perfil");
        } else {
            alert("Correo o contraseña incorrectos");
        }
    };
    
    const passOlvidada = () => {
        if (!correo) alert("Ingresa tu correo para recuperar la contraseña");
        else alert(`Se ha enviado un correo de recuperación a ${correo}`);
    };

    return (
        <Base_Main tituloPagina="Iniciar Sesión">
            <div className="cuenta-content">
                <form className="cuenta-form" onSubmit={logearUsuario}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Correo</td>
                                <td><input
                                type="email"
                                name="correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required/></td>
                            </tr>
                            <tr>
                                <td>Contraseña</td>
                                <td><input
                                type="password"
                                name="pass"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required/></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p><a href="#" onClick={passOlvidada}>¿Olvidaste tu contraseña?</a></p>
                    <button type="submit" className="cuenta-btn">
                        Iniciar Sesión
                    </button>
                    
                    <p className="cuenta-login-text">¿Aún no tienes cuenta?</p>
                    <Link to="/registro">Registrarse</Link>
                </form>
            </div>
        </Base_Main>
    );
}
