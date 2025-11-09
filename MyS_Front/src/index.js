{/* MySpace\MyS_Front\src\index.js */}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './paginas/Home';
import Registro from "./paginas/logeo/Registro";
import Cuenta from "./paginas/logeo/Cuenta";
import Perfil from "./paginas/perfil/Perfil";
import EditarP from "./paginas/perfil/EditarPerfil";
import General from "./paginas/tableros/General";

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
        <Route path="/general" element={<General />} />

        {/* Sitios privados */}
        <Route path="/perfil" element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>}/>
        <Route path="/editar" element={
            <PrivateRoute>
              <EditarP />
            </PrivateRoute>}/>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
