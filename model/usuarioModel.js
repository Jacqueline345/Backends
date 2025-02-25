const mongoose = require('mongoose');
const usuarios = new mongoose.Schema({
    nombre: {
        type: String
    },
    apellidos: {
        type: String
    },
    telefono: {
        type: Number
    },
    correos: {
        type: String
    },
    nacimiento: {
        type: String
    },
    pais: {
        type: String
    },
    contraseña: {
        type: String
    },
    pin: {
        type: String
    }
});

module.exports = mongoose.model('usuarios', usuarios);