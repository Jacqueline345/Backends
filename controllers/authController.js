const usuarioModel = require("../model/usuarioModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inicio de sesión
async function loginUsuario(req, res) {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await usuarioModel.findOne({ correos: correo });
        
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        if(usuario.estado !== 'activo') {
            return res.status(403).json({ message: 'Usuario inactivo' });
        }

        const isMatch = contrasena === usuario.contrasena; // Comparación directa
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        console.log('Contenido de la sesión:', req.session);
        const telefono= req.session.telefono = usuario.telefono;
        console.log('Teléfono almacenado en la sesión:', telefono);
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
        req.session.userId = usuario.id; // Almacena el ID del usuario en la sesión

        // 👇 Incluimos estado y nombre aquí
        res.status(200).json({
            message: 'Login exitoso',
            token,
            estado: usuario.estado,
            nombre: usuario.nombre,
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
}

// Cierre de sesión
function logoutUsuario(req, res) {
    res.status(200).json({ message: 'Logout exitoso' });
}



module.exports = {
    loginUsuario,
    logoutUsuario,
};