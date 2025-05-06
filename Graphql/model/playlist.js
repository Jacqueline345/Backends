const mongoose = require('mongoose');
const playlist = new mongoose.Schema({
    nombre_playlist: {
        type: String,
        required: true
    },
    perfiles_asociados: {
        type: String,
        require: true
    }

});

module.exports = mongoose.model('playlist', playlist);