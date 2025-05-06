const express = require('express');
const passport = require('passport');
const router = express.Router();
const Usuario = require ('../Graphql/model/usuarioModel');
const { sendVerificationEmail } = require('../controllers/emailController');
const jwt = require('jsonwebtoken');

// === 1. INICIAR LOGIN CON GOOGLE ===
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// === 2. CALLBACK DESPUÉS DEL LOGIN CON GOOGLE ===
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // Verificamos primero por correo
      console.log('Información del usuario después de Google login:', req.user);
      const user = await Usuario.findOne({ correos: req.user.correos });
      
      // Si el usuario ya existe y está activo
      if (user) {
        console.log('Usuario encontrado:', user);
        console.log('Estado del usuario:', user.estado);

        if (user.estado === 'activo') {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          const redirectURL = `http://localhost:3001/googleLogin.html?token=${token}&id=${user._id}&nombre=${user.nombre}`;
          return res.redirect(redirectURL);
        } else {
          console.log('El usuario no está activo');
        }
      } else {
        console.log('No se encontró usuario con ese correo en la base de datos');
      }

      // Si no existe o el estado no es activo → redirigir al formulario de registro
      const { googleId, nombre, apellidos, correos } = req.user;
      const redirectUrl = `/registroGoogle.html?googleId=${googleId}&nombre=${encodeURIComponent(nombre)}&apellidos=${encodeURIComponent(apellidos)}&correos=${encodeURIComponent(correos)}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error en el callback de Google:', error);
      res.status(500).send('Error al procesar el inicio de sesión');
    }
  }
);

// === 3. COMPLETAR REGISTRO DESPUÉS DE GOOGLE ===
router.post('/google/complete-registration/:googleId', async (req, res) => {
  try {
    const { googleId } = req.params;
    const { nombre, apellidos, correos, contrasena, telefono, nacimiento, direccion, edad, pin } = req.body;

    let usuario = await Usuario.findOne({ googleId });
    if (!usuario) {
      usuario = new Usuario({ googleId });
    }

    // Llenar los campos
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

    // Enviar correo de verificación
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(correos, nombre, token);

    res.json({ success: true });
  } catch (error) {
    console.error('Error en registro con Google:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === 4. VERIFICACIÓN DE CORREO ===
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  console.log('Token recibido: ', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      console.log('Usuario no encontrado');
      return res.status(404).send('Usuario no encontrado');
    }

    console.log('Usuario encontrado para verificación:', usuario);
    if (usuario.estado !== 'activo') {
      console.log('Estado previo del usuario:', usuario.estado);
      usuario.estado = 'activo';
      await usuario.save();
      console.log('Estado actualizado a activo');
    }

    res.redirect('/verificado.html');
  } catch (error) {
    console.error('Error al verificar el correo:', error.message);
    res.status(400).send('Token inválido o expirado');
  }
});

module.exports = router;
