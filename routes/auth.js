const express = require('express');
const passport = require('passport');
const router = express.Router();
const Usuario = require ('../Graphql/model/usuarioModel');
const { sendVerificationEmail } = require('../controllers/emailController');
const jwt = require('jsonwebtoken');

// Ruta para iniciar autenticación con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/google/login',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const { googleId, nombre, apellidos, correos } = req.user;
    const redirectUrl = `/registroGoogle.html?googleId=${googleId}&nombre=${encodeURIComponent(nombre)}&apellidos=${encodeURIComponent(apellidos)}&correos=${encodeURIComponent(correos)}`;
    res.redirect(redirectUrl);
  }
);

// Ruta para completar el registro después de Google
router.post('/google/complete-registration/:googleId', async (req, res) => {
  try {
    const { googleId } = req.params;
    const { nombre, apellidos, correos, contrasena, telefono, nacimiento, direccion, edad, pin } = req.body;

    // Si no existe el usuario, lo creamos con googleId
    let usuario = await Usuario.findOne({ googleId });
    if (!usuario) {
      usuario = new Usuario({ googleId });
    }

    // Completar los campos faltantes
    usuario.nombre = nombre;
    usuario.apellidos = apellidos;
    usuario.correos = correos;
    usuario.contrasena = contrasena;
    usuario.telefono = telefono;
    usuario.nacimiento = nacimiento;
    usuario.direccion = direccion;
    usuario.edad = edad;
    usuario.pin = pin;

    await usuario.save();
    // Generar el token de verificación
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar el correo con el token
    await sendVerificationEmail(correos, nombre, token);

    res.json({ success: true });

  } catch (error) {
    console.error('Error en registro con Google:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta: GET /auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
    const { token } = req.params;
    console.log('Token recibido: ', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const usuario = await Usuario.findById(decoded.id);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        if (usuario.estado !== 'activo') {
            usuario.estado = 'activo';
            await usuario.save();
        }

        // Redirige a la vista de éxito
        res.redirect('/verificado.html');

    } catch (error) {
        console.error('Error al verificar el correo:', error.message);
        res.status(400).send('Token inválido o expirado');
    }
});

// Ruta para login con Google (si ya está registrado y activo)
router.get('/google/login-success',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const { googleId } = req.user;

    const usuario = await Usuario.findOne({ googleId });

    if (!usuario || usuario.estado !== 'activo') {
      return res.redirect('/noAutorizado.html'); // Puedes crear esta vista
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirigir al frontend con el token como parámetro
    res.redirect(`/googleLoginSuccess.html?token=${token}&nombre=${encodeURIComponent(usuario.nombre)}`);
  }
);

module.exports = router;