const express = require('express');
const router = express.Router();
const Usuario = require('./model/usuarioModel'); // Asegúrate de importar tu modelo correctamente

router.post('/login', async (req, res) => {
    const { pin } = req.body;
    console.log("PIN recibido en backend:", pin); // Verifica qué está llegando

    try {
        const usuario = await Usuario.findOne({ pin: Number(pin) });


        if (usuario) {
            return res.json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "PIN incorrecto" });
        }
    } catch (error) {
        console.error("Error al validar el PIN:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

module.exports = router;
