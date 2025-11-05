const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Ruta de registro (vulnerable a SQL Injection)
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Vulnerable: concatenación directa de la consulta
    const sql = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
    
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/auth/login');
    });
});

// Ruta de login (vulnerable a SQL Injection)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Vulnerable: concatenación directa de la consulta
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
            req.session.userId = results[0].id;
            req.session.username = results[0].username;
            res.redirect('/courses');
        } else {
            res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para mostrar formulario de login
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Ruta para mostrar formulario de registro
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Ruta de logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    next();
};

// Ruta del dashboard (vulnerable a SQL Injection)
// Dashboard del usuario
router.get('/dashboard', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    
    // Consulta vulnerable para obtener cursos recientes
    const recentCoursesQuery = `
        SELECT DISTINCT c.* 
        FROM courses c 
        JOIN comments cm ON c.id = cm.course_id 
        WHERE cm.user_id = ${userId} 
        ORDER BY cm.created_at DESC 
        LIMIT 5
    `;

    // Consulta vulnerable para obtener comentarios recientes
    const recentCommentsQuery = `
        SELECT cm.*, c.title as course_title 
        FROM comments cm 
        JOIN courses c ON cm.course_id = c.id 
        WHERE cm.user_id = ${userId} 
        ORDER BY cm.created_at DESC 
        LIMIT 5
    `;

    // Ejecutar ambas consultas vulnerables
    db.query(recentCoursesQuery, (err, recentCourses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.query(recentCommentsQuery, (err, recentComments) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.render('auth/dashboard', {
                recentCourses: recentCourses,
                recentComments: recentComments
            });
        });
    });
});

// Mis cursos
router.get('/my-courses', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    
    // Consulta vulnerable
    const sql = `
        SELECT DISTINCT c.* 
        FROM courses c 
        LEFT JOIN comments cm ON c.id = cm.course_id 
        WHERE cm.user_id = ${userId} 
        ORDER BY c.title
    `;
    
    db.query(sql, (err, courses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('auth/my-courses', { courses });
    });
});

// Perfil de usuario
router.get('/profile', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    
    // Consulta vulnerable
    const sql = `SELECT * FROM users WHERE id = ${userId}`;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        const userProfile = results[0] || {};
        res.render('auth/profile', {
            userEmail: userProfile.email || '',
            userBio: userProfile.bio || ''
        });
    });
});

// Configuración
router.get('/settings', isAuthenticated, (req, res) => {
    res.render('auth/settings');
});

// Actualizar perfil (vulnerable a SQL Injection)
router.post('/profile', isAuthenticated, (req, res) => {
    const { email, bio } = req.body;
    const userId = req.session.userId;
    
    // Consulta vulnerable
    const sql = `
        UPDATE users 
        SET email = '${email}', bio = '${bio}' 
        WHERE id = ${userId}
    `;
    
    db.query(sql, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/auth/profile');
    });
});

// Cambiar contraseña (vulnerable a SQL Injection)
router.post('/settings/password', isAuthenticated, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;
    
    // Consulta vulnerable
    const sql = `
        UPDATE users 
        SET password = '${newPassword}' 
        WHERE id = ${userId} AND password = '${currentPassword}'
    `;
    
    db.query(sql, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/auth/settings');
    });
});

module.exports = router;