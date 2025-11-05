-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS cyber_courses;
USE cyber_courses;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url VARCHAR(255),
    duration VARCHAR(50),
    level VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    user_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertar algunos cursos de ejemplo
INSERT INTO courses (title, description, video_url, duration, level, category) VALUES
('Introducción a la Inyección SQL | Ciberseguridad desde cero', 'Aprende sobre uno de los ataques más comunes en aplicaciones web', 'https://www.youtube.com/watch?v=DW_fU_Oq3t0', '20 minutos', 'Principiante', 'Ataques Web'),
('¿Qué es Cross-site Scripting (XSS)? Demostración y RIESGOS de esta VULNERABILIDAD', 'Descubre cómo funciona XSS y cómo prevenirlo', 'https://www.youtube.com/watch?v=lG2XpAgy0Ns', '17 minutos', 'Intermedio', 'Ataques Web'),
('¿Qué es Ataque de Fuerza bruta? | Tipos de Fuera bruta | Como funciona la fuerza bruta', 'Metodologías y herramientas para ataques de fuerza bruta', 'https://www.youtube.com/watch?v=IuYHbwV0qPI', '7 minutos', 'Avanzado', 'Seguridad de Contraseñas');