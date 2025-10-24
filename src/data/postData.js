// src/data/postsData.js
import perfilData from "./perfilData";

const postsData = [
  {
    id: 1,
    author: perfilData.nombre,
    avatar: perfilData.imagen,
    date: "[01/01/2025 - 10:00:00] :",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    image: "/hollow.jpg",
  },
  {
    id: 2,
    author: perfilData.nombre,
    avatar: perfilData.imagen,
    date: "[02/01/2025 - 11:30:00] :",
    content: "Otro contenido interesante sin imagen adjunta.",
    image: null,
  },
  {
    id: 3,
    author: perfilData.nombre,
    avatar: perfilData.imagen,
    date: "[03/01/2025 - 09:15:00] :",
    content: "Este es un tercer post con su propia información.",
    image: "/image.png",
  },
  {
    id: 4,
    author: perfilData.nombre,
    avatar: perfilData.imagen,
    date: "[04/01/2025 - 14:45:00] :",
    content: "Un cuarto post para completar la lista de ejemplo.",
    image: null,
  },
];

export default postsData;
