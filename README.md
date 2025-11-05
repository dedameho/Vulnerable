# Aplicación Vulnerable para Laboratorio de Ciberseguridad

⚠️ **ADVERTENCIA**: Esta aplicación es intencionalmente vulnerable para propósitos educativos. NO usar en producción.

## Vulnerabilidades Incluidas

1. SQL Injection
   - En la búsqueda de cursos
   - En el login y registro de usuarios
   - En la visualización de cursos y comentarios

2. Cross-Site Scripting (XSS)
   - En la visualización de títulos y descripciones de cursos
   - En los comentarios de usuarios
   - En los mensajes de error

## Requisitos

- Node.js
- MySQL

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar la base de datos:
   - Crear un archivo `.env` basado en `.env.example`
   - Importar el esquema de la base de datos:
   ```bash
   mysql -u tu_usuario -p < database.sql
   ```

4. Iniciar la aplicación:
   ```bash
   npm start
   ```

## Uso con Fines Educativos

Esta aplicación está diseñada para practicar y aprender sobre:
- Identificación de vulnerabilidades
- Explotación de SQL Injection
- Explotación de XSS
- Buenas prácticas de seguridad

## Ejemplos de Ataques

### SQL Injection
- En la búsqueda: `' OR '1'='1`
- En el login: `' OR '1'='1' --`

### XSS
- En comentarios: `<script>alert('XSS')</script>`
- En la búsqueda: `<img src=x onerror="alert('XSS')">`