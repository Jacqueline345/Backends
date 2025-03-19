const mongoose = require('mongoose');
const restringido = new mongoose.Schema({
    nombre_completo: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required:true
    },
    edad: {
        type: Number,
        required:true
    },
    pin: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('restringidos', restringido);