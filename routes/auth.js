const express = require('express');
const passport = require('passport');
const router = express.Router();
const Usuario = require ('../Graphql/model/usuarioModel');
const { sendVerificationEmail } = require('../controllers/emailController');

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
    await sendVerificationEmail(usuario.correos, usuario.nombre, usuario._id);

    res.json({ success: true });

  } catch (error) {
    console.error('Error en registro con Google:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para verificar el correo y activar la cuenta
router.get('/verify-email/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    if (usuario.activo) {
      return res.send('Tu cuenta ya fue verificada. Puedes iniciar sesión.');
    }

    usuario.activo = true;
    await usuario.save();

    res.redirect('/login.html'); // Redirige a la pantalla de login

  } catch (error) {
    console.error('Error al verificar el correo:', error);
    res.status(500).send('Error al verificar el correo');
  }
});

module.exports = router;