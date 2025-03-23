const mongose = require('mongoose');

const busquedaVideo = new mongose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true    
    },
    playlistId: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'videos',
        required: true
    }
});

module.exports = mongose.model('buscar', busquedaVideo);