const usuarioModel = require("../model/usuarioModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
async function registerUsuario(req, res) {
    try {
        const { nombre, apellidos, telefono, correos, nacimiento, pais, contraseña, pin } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const usuario = new usuarioModel({ nombre, apellidos, telefono, correos, nacimiento, pais, contraseña: hashedPassword, pin });
        await usuario.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
}

//Inicio sesión
async function loginUsuario(req, res) {
    const { correo, contraseña } = req.body;
    const usuario = await usuarioModel.findOne({ correos: correo });
    if (!usuario) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const isMatch = contraseña == usuario.contraseña;
    if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: usuario._id }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login exitoso', token });
}

// Cierre de sesión
function logoutUsuario(req, res) {
    res.status(200).json({ message: 'Logout exitoso' });
}


module.exports = {
    registerUsuario,
    loginUsuario,
    logoutUsuario
};
