const mongoose = require('mongoose');
const usuarios = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    correos: {
        type: String,
        required: true,
    },
    nacimiento: {
        type: Date,
        required: true
    },
    pais: {
        type: String
    },
    contraseña: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true,
        minlength: 6 
    }
});

module.exports = mongoose.model('usuarios', usuarios);