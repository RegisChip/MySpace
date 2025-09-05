-- PostgreSQL version of the MySQL script
-- Schema: myspace_db

-- Create schema
-- CREATE SCHEMA IF NOT EXISTS myspace_db;
-- SET search_path TO myspace_db;

-- GLOSARIO
-- Serial -> dato entero, incrementado automaticamente
-- unique -> que no se repita o duplique este dato
-- "like" -> tiene comillas para eviatr error de sintaxis

-- Table: usuario
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL,
  apellido_p VARCHAR(20) NOT NULL,
  apellido_m VARCHAR(20) NOT NULL,
  correo VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  fecha_nacimiento TIMESTAMP NOT NULL
);

-- Table: perfil
CREATE TABLE IF NOT EXISTS perfil (
  id_perfil SERIAL PRIMARY KEY,
  nom_usuario VARCHAR(30) NOT NULL UNIQUE,
  descripcion TEXT,
  foto_perfil VARCHAR(255),
  usuario_id_usuario INTEGER NOT NULL,
  CONSTRAINT fk_perfil_usuario FOREIGN KEY (usuario_id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE
);

-- Table: publicacion
CREATE TABLE IF NOT EXISTS publicacion (
  id_publicacion SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  fecha_pub DATE NOT NULL DEFAULT CURRENT_DATE,
  like_pub INTEGER NOT NULL DEFAULT 0,
  perfil_id_perfil INTEGER NOT NULL,
  CONSTRAINT fk_publicacion_perfil FOREIGN KEY (perfil_id_perfil)
    REFERENCES perfil (id_perfil)
    ON DELETE CASCADE
);

-- Table: fotos
CREATE TABLE IF NOT EXISTS fotos (
  id_fotos SERIAL PRIMARY KEY,
  ruta_foto VARCHAR(255) NOT NULL,
  publicacion_id_publicacion INTEGER NOT NULL,
  CONSTRAINT fk_fotos_publicacion FOREIGN KEY (publicacion_id_publicacion)
    REFERENCES publicacion (id_publicacion)
    ON DELETE CASCADE
);

-- Table: seguidores
CREATE TABLE IF NOT EXISTS seguidores (
  perfil_id_seguidor INTEGER NOT NULL,
  perfil_id_seguido INTEGER NOT NULL,
  PRIMARY KEY (perfil_id_seguidor, perfil_id_seguido),
  CONSTRAINT fk_seguidor_perfil FOREIGN KEY (perfil_id_seguidor)
    REFERENCES perfil (id_perfil)
    ON DELETE CASCADE,
  CONSTRAINT fk_seguido_perfil FOREIGN KEY (perfil_id_seguido)
    REFERENCES perfil (id_perfil)
    ON DELETE CASCADE,
  CONSTRAINT check_no_self_follow CHECK (perfil_id_seguidor <> perfil_id_seguido)
);

-- Table: comentario
CREATE TABLE IF NOT EXISTS comentario (
  id_comentario SERIAL PRIMARY KEY,
  texto VARCHAR(500),
  like_com INTEGER DEFAULT 0,
  fecha_com TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  publicacion_id_publicacion INTEGER NOT NULL,
  perfil_id_perfil INTEGER NOT NULL,
  CONSTRAINT fk_comentario_publicacion FOREIGN KEY (publicacion_id_publicacion)
    REFERENCES publicacion (id_publicacion)
    ON DELETE CASCADE,
  CONSTRAINT fk_comentario_perfil FOREIGN KEY (perfil_id_perfil)
    REFERENCES perfil (id_perfil)
    ON DELETE CASCADE
);

-- Table: configuraciones_usuario
CREATE TABLE IF NOT EXISTS configuraciones_usuario (
  id_config_user SERIAL PRIMARY KEY,
  modo_tema VARCHAR(10) NOT NULL DEFAULT 'claro' CHECK (modo_tema IN ('claro', 'obscuro')),
  tipo_fond VARCHAR(10) NOT NULL DEFAULT 'color' CHECK (tipo_fond IN ('color', 'imagen')),
  fuente VARCHAR(200) NOT NULL DEFAULT 'Arial',
  tam_fuente VARCHAR(10) NOT NULL DEFAULT '16px',
  color_fuente VARCHAR(45) NOT NULL DEFAULT '#000000',
  color_primario VARCHAR(20) NOT NULL DEFAULT '#3498db',
  color_secundario VARCHAR(45) NOT NULL DEFAULT '#2ecc71',
  acentos VARCHAR(45) NOT NULL DEFAULT '#e74c3c',
  perfil_id_perfil INTEGER NOT NULL,
  CONSTRAINT fk_configuraciones_usuario_perfil FOREIGN KEY (perfil_id_perfil)
    REFERENCES perfil (id_perfil)
    ON DELETE CASCADE
);
