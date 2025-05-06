const Usuario = require('../Graphql/model/usuarioModel')
const jwt = require('jsonwebtoken');

async function verificarCodigo(req, res) {
    try {
        // Suponiendo que el userId se envía en el cuerpo de la solicitud
        const { userId, codigoIngresado } = req.body;
        console.log('Datos recibidos:', req.body);

        // Asegúrate de que se ha enviado un userId
        if (!userId || !codigoIngresado) {
            return res.status(400).json({ error: 'ID de usuario o código no proporcionado' });
        }

        // Buscar al usuario en la base de datos
        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el código 2FA es válido
        if (usuario.codigo2FA !== parseInt(codigoIngresado)) {
            return res.status(400).json({ error: 'Código incorrecto' });
        }

        // Verificar si el código 2FA ha expirado
        if (Date.now() > usuario.codigoExpira) {
            return res.status(400).json({ error: 'Código expirado' });
        }
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        return res.json({ token, mensaje: 'Autenticación completa' });
    }
    catch (error) {
        console.error('Error al verificar el código:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
module.exports = {
    verificarCodigo
};