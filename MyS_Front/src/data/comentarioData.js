// src/data/comentariosData.js
import perfilData from "./perfilData";

const usuario = perfilData[0];

const comentariosData = [
  {
    id: 1,
    postId: 1, // Relaciona el comentario con el post id 1
    author: usuario.nombre,
    avatar: usuario.imagen,
    date: "[01/01/2025 - 10:30:00] :",
    content: "¡Qué buen post! Me encantó la información que compartiste.",
    image: null,
  },
  {
    id: 2,
    postId: 1,
    author: usuario.nombre,
    avatar: usuario.imagen,
    date: "[01/01/2025 - 10:45:00] :",
    content: "Agrego una imagen de ejemplo para ilustrar mejor mi comentario.",
    image: null,
  },
  {
    id: 3,
    postId: 2,
    author: usuario.nombre,
    avatar: usuario.imagen,
    date: "[02/01/2025 - 12:00:00] :",
    content: "Interesante, me gustaría ver más detalles sobre este tema.",
    image: null,
  },
  {
    id: 4,
    postId: 3,
    author: usuario.nombre,
    avatar: usuario.imagen,
    date: "[03/01/2025 - 09:45:00] :",
    content: "Gracias por compartir, esto me fue muy útil.",
    image: null,
  },
];

export default comentariosData;
