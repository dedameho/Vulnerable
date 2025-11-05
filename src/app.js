require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secreto-inseguro',
    resave: false,
    saveUninitialized: true
}));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware para compartir datos del usuario con todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.username;
    res.locals.userId = req.session.userId;
    next();
});

// Mensaje de advertencia sobre la vulnerabilidad
app.use((req, res, next) => {
    res.locals.warning = "⚠️ ADVERTENCIA: Esta aplicación es intencionalmente vulnerable para propósitos educativos. NO usar en producción.";
    next();
});

// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});