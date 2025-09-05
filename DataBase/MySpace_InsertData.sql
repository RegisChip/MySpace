
-- Datos insertados

CREATE EXTENSION IF NOT EXISTS pgcrypto

INSERT INTO usuario(nombre, apellido_p, apellido_m,
					correo, contrasena, fecha_nacimiento)
			 VALUES ('Regina', 'Rodriguez', 'Magana',
					 'regina@gmail.com', crypt('1234', gen_salt('bf')),
					 '2004-06-15'),
					('Leo', 'Blanco', 'Ambriz',
					 'leo@gmail.com', crypt('1234', gen_salt('bf')),
					 '2004-05-17'),
					('Agata', 'Rodriguez', 'Magana',
					 'agata@gmail.com', crypt('1234', gen_salt('bf')),
					 '2004-06-15')
-- SELECT * FROM usuario

INSERT INTO perfil(nom_usuario, usuario_id_usuario) 
		   VALUES ('ReginaYOLO', 1), 
				  ('LeoXD', 2),
				  ('AgatasCorp', 3)
-- SELECT * FROM perfil

INSERT INTO publicacion(texto, fecha_pub, like_pub, perfil_id_perfil)
			    VALUES ('Hola', '2025-09-03', 1, 1),
				('Toca comer sandwitch', '2025-09-03', 0, 1),
				('Hay que hacer tarea', '2025-09-03', 0, 2),
				('Comamos ramen', '2025-09-03', 0, 1),
				('Quiero una estufa y una tele y una 
				 lavadora y una bocina y una switch 
				 y un refri y', '2025-09-03', 2, 1)
-- SELECT * FROM publicacion

INSERT INTO comentario(texto, fecha_com, like_com,
					   publicacion_id_publicacion, perfil_id_perfil)
			   VALUES ('Hola', '2025-09-03', 1, 1, 2),
					  ('Vamos a lonchear', '2025-09-03', 0, 2, 2),
					  ('yaseee', '2025-09-03', 0, 3, 1),
					  ('Vamos', '2025-09-03', 1, 4, 2),
					  ('Que traes tu', '2025-09-03', 1, 5, 2)
-- SELECT * FROM comentario
