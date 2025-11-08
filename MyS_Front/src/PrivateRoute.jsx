// MySpace\MyS_Front\src\PrivateRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  return usuario ? children : <Navigate to="/cuenta" />;
}
