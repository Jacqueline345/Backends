const usuarioModel = require("../model/usuarioModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Inicio de sesión
async function loginUsuario(req, res) {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await usuarioModel.findOne({ correos: correo });

        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        if (usuario.estado !== 'activo') {
            return res.status(403).json({ message: 'Usuario inactivo' });
        }

        const isMatch = contrasena === usuario.contrasena; // Comparación directa
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        let telefono = String(req.session.telefono = usuario.telefono);
        console.log('Teléfono almacenado en la sesión:', telefono);

        if (!telefono.startsWith('+506')) {
            telefono = '+506' + telefono;
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
        req.session.userId = usuario.id; // Almacenar ID en sesión

        // Generar código de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();


        // Guardar código temporalmente en BD o memoria
        usuario.codigo2FA = codigo;
        usuario.codigoExpira = Date.now() + 5 * 60 * 1000; // 5 minutos
        await usuario.save();

        // Enviar SMS con Twilio
        await client.messages.create({
            body: `Tu código de verificación es: ${codigo}`,
            from: process.env.TWILIO_PHONE_NUMBER, // número de Twilio
            to: telefono
        });

        // Enviar respuesta de login exitoso y redirigir al frontend
        res.status(200).json({
            message: 'Login exitoso, código enviado por SMS',
            token,
            id: usuario._id,
            estado: usuario.estado,
            nombre: usuario.nombre,
            codigo2FA: usuario.codigo2FA, // Enviar el código para verificarlo en el frontend
            codigoExpira: usuario.codigoExpira, // Enviar la fecha de expiración del código
            redirectURL: '/Codigo' // Redirigir a la página para ingresar el código
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