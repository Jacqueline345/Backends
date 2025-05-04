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
    contrasena: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true,
        minlength: 6 
    },
    estado: {
        type: String,
        enum: ['activo', 'pendiente'],
        default: 'pendiente'
    },
});

module.exports = mongoose.model('usuarios', usuarios);