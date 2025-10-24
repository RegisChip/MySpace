import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home_prin/Home';
import Cuenta from "./cuenta_usr/Cuenta";
import Registro from "./cuenta_usr/Registro";
import Perfil from "./cuenta_usr/Perfil";
import General from "./cuenta_usr/tableros/General";
import EditarP from "./cuenta_usr/EditarP";
import PrivateRoute from './PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Sitio público */}
        <Route path="/" element={<Home />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/registro" element={<Registro />} />

        {/* Sitios privados */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar"
          element={
            <PrivateRoute>
              <EditarP />
            </PrivateRoute>
          }
        />
        <Route
          path="/general"
          element={
            <PrivateRoute>
              <General />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
