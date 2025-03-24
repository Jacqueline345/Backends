const mongoose = require('mongoose');
const video = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    playlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'playlist',
        required: false
    }
});

module.exports = mongoose.model('videos', video);