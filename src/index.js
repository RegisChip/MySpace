import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home_prin/Home';
import Cuenta from "./cuenta_usr/Cuenta";
import Registro from "./cuenta_usr/Registro";
import Perfil from "./cuenta_usr/Perfil";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Sitio público */}
        <Route path="/" element={<Home />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

