const usuarioModel = require("../model/usuarioModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inicio de sesión
async function loginUsuario(req, res) {
    try {
        const { correo, contraseña } = req.body;
        const usuario = await usuarioModel.findOne({ correos: correo });
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: usuario._id }, 'secretKey', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
}

// Cierre de sesión
function logoutUsuario(req, res) {
    res.status(200).json({ message: 'Logout exitoso' });
}

module.exports = {
    loginUsuario,
    logoutUsuario
};