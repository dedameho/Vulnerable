const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
    // Consulta vulnerable a SQL Injection
    const sql = 'SELECT * FROM courses ORDER BY created_at DESC LIMIT 5';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('index', { 
            courses: results,
            user: req.session.username
        });
    });
});

module.exports = router;