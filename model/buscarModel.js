const mongose = require('mongoose');

const busquedaVideo = new mongose.Schema({
    title: String,
    description: String,
    playlistId: mongose.Schema.Types.ObjectId
});

module.exports = mongose.model('Video', busquedaVideo);