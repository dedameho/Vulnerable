const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Listar todos los cursos (vulnerable a SQL Injection)
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM courses ORDER BY created_at DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('courses/index', { 
            courses: results
        });
    });
});

// Ruta vulnerable a SQL Injection
router.get('/search', (req, res) => {
    const { query } = req.query;
    // Vulnerable: concatenación directa de la consulta
    const sql = `SELECT * FROM courses WHERE title LIKE '%${query}%' OR description LIKE '%${query}%'`;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('courses/search', { 
            courses: results, 
            query
        });
    });
});

// Ruta para mostrar un curso específico (vulnerable a SQL Injection)
router.get('/:id', (req, res) => {
    const courseId = req.params.id;
    // Vulnerable: concatenación directa de la consulta
    const sql = `SELECT * FROM courses WHERE id = ${courseId}`;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        // Obtener comentarios (también vulnerable a SQL Injection)
        const commentsSql = `SELECT * FROM comments WHERE course_id = ${courseId}`;
        db.query(commentsSql, (err, comments) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.render('courses/detail', { 
                course: results[0], 
                comments: comments,
                userId: req.session.userId 
            });
        });
    });
});

// Ruta para agregar comentarios (vulnerable a XSS)
router.post('/:id/comments', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Debe iniciar sesión para comentar');
    }

    const { comment } = req.body;
    const courseId = req.params.id;
    const userId = req.session.userId;

    // Vulnerable: sin escape de caracteres especiales
    const sql = `INSERT INTO comments (course_id, user_id, content) VALUES (${courseId}, ${userId}, '${comment}')`;
    
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect(`/courses/${courseId}`);
    });
});

module.exports = router;