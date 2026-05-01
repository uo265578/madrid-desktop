CREATE DATABASE IF NOT EXISTS UO265578_DB
   CHARACTER SET utf8
   COLLATE utf8_general_ci;

USE UO265578_DB;

CREATE TABLE IF NOT EXISTS tabla_tipos (
   id_tipo INT AUTO_INCREMENT PRIMARY KEY,
   nombre_tipo VARCHAR(100) NOT NULL,
   descripcion TEXT
);

CREATE TABLE IF NOT EXISTS tabla_usuarios (
   id_usuario INT AUTO_INCREMENT PRIMARY KEY,
   nombre VARCHAR(100) NOT NULL,
   email VARCHAR(150) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tabla_recursos (
   id_recurso INT AUTO_INCREMENT PRIMARY KEY,
   id_tipo INT NOT NULL,
   nombre VARCHAR(200) NOT NULL,
   descripcion TEXT,
   precio DECIMAL(10,2) NOT NULL,
   plazas_max INT NOT NULL,
   fecha_inicio DATE NOT NULL,
   hora_inicio TIME NOT NULL,
   fecha_fin DATE NOT NULL,
   hora_fin TIME NOT NULL,
   FOREIGN KEY (id_tipo) REFERENCES tabla_tipos(id_tipo)
);

CREATE TABLE IF NOT EXISTS tabla_reservas (
   id_reserva INT AUTO_INCREMENT PRIMARY KEY,
   id_usuario INT NOT NULL,
   id_recurso INT NOT NULL,
   fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
   num_personas INT NOT NULL,
   precio_total DECIMAL(10,2) NOT NULL,
   estado ENUM('confirmada','anulada','pendiente') DEFAULT 'confirmada',
   FOREIGN KEY (id_usuario) REFERENCES tabla_usuarios(id_usuario),
   FOREIGN KEY (id_recurso) REFERENCES tabla_recursos(id_recurso)
);

CREATE TABLE IF NOT EXISTS tabla_imagenes (
   id_imagen INT AUTO_INCREMENT PRIMARY KEY,
   id_recurso INT NOT NULL,
   nombre_imagen VARCHAR(255) NOT NULL,
   descripcion_imagen VARCHAR(500),
   FOREIGN KEY (id_recurso) REFERENCES tabla_recursos(id_recurso)
);

INSERT INTO tabla_tipos (nombre_tipo, descripcion) VALUES
('Museo', 'Museos y espacios culturales de Madrid'),
('Ruta', 'Rutas guiadas y excursiones turísticas'),
('Gastronomía', 'Experiencias gastronómicas y restaurantes'),
('Monumento', 'Visitas a monumentos y patrimonio histórico'),
('Excursión', 'Excursiones de día completo desde Madrid');

INSERT INTO tabla_recursos
   (id_tipo, nombre, descripcion, precio, plazas_max,
    fecha_inicio, hora_inicio, fecha_fin, hora_fin)
VALUES
(1, 'Visita guiada Museo del Prado',
'Tour guiado por las principales obras del Museo del Prado con experto en arte.',
25.00, 20, '2026-05-01', '10:00:00', '2026-12-31', '13:00:00'),
(2, 'Tour Madrid Histórico',
'Recorrido guiado por los principales monumentos históricos del centro de Madrid.',
15.00, 25, '2026-05-01', '09:00:00', '2026-12-31', '13:00:00'),
(3, 'Ruta Gastronómica Madrileña',
'Experiencia culinaria visitando los mercados y restaurantes típicos de Madrid.',
45.00, 15, '2026-05-01', '19:00:00', '2026-12-31', '22:30:00'),
(4, 'Visita guiada Palacio Real',
'Visita guiada por las salas principales del Palacio Real de Madrid.',
18.00, 30, '2026-05-01', '10:00:00', '2026-12-31', '14:00:00'),
(5, 'Excursión El Escorial y Valle de los Caídos',
'Excursión de día completo al Monasterio de El Escorial y alrededores.',
35.00, 40, '2026-05-01', '08:30:00', '2026-12-31', '19:00:00');

INSERT INTO tabla_imagenes (id_recurso, nombre_imagen, descripcion_imagen) VALUES
(1, 'prado_entrada.jpg', 'Entrada principal del Museo del Prado'),
(2, 'plaza_mayor.jpg', 'Plaza Mayor de Madrid'),
(3, 'mercado_san_miguel.jpg', 'Mercado de San Miguel'),
(4, 'palacio_real.jpg', 'Fachada del Palacio Real'),
(5, 'el_escorial.jpg', 'Monasterio de El Escorial');