const videoModel = require('../model/videoModel');

/**
 * Create Video
 * @param {*} req 
 * @param {*} res 
 */
const createVideo = async (req, res) => {
    let video = new videoModel();

    video.title = req.body.title;
    video.url = req.body.url;
    video.description = req.body.description;
    video.playlistId = req.body.playlistId;

    if (video.title && video.url) {
        video.save()
            .then(() => {
                res.status(201);
                res.header({
                    'location': `/videos/?id=${video.id}`
                });
                res.json(video);
            })
            .catch((err) => {
                res.status(422);
                console.log('error while saving the video', err);
                res.json({
                    err: 'There was an error saving the video'
                });
            });
    } else {
        res.status(422);
        console.log('error while saving the video');
        res.json({
            error: 'No valid data provided for video'
        });
    }
};

/**
 * Get all videos or a single video by ID
 * @param {*} req 
 * @param {*} res 
 */
const getVideo = (req, res) => {
    const id = req.params.id;

    if (id) {
        //obtener un video por ID
        videoModel.findById(id)
            .then((video) => {
                if (!video) {
                    res.status(404).json({ message: 'Video no encontrado' });
                } else {
                    res.json(video);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener el video' });
                console.log('Error al obtener el video:  ', err);
            });
    } else {
        //obtener todos los videos
        videoModel.find()
            .then((videos) => {
                if (videos.length === 0) {
                    res.status(404).json({ message: 'No se encontraron videos' });
                } else {
                    res.json(videos);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtner los videos' });
                console.log('Error al obtener los videos: ', err);
            });
    }
};

/**
 * Updates a video
 * @param {*} req 
 * @param {*} res 
 */
const updateVideo = (req, res) => {
    if (req.query && req.query.id) {
        videoModel.findById(req.query.id)
            .then(video => {
                if (video) {
                    //update the video fields
                    video.title = req.body.title || video.title;
                    video.url = req.body.url || video.url;
                    video.description = req.body.description || video.description;
                    video.playlistId = req.body.playlistId || video.playlistId;
                    video.save()
                        .then(() => {
                            res.json(video);
                        })
                        .catch((err) => {
                            res.status(422);
                            console.log('error while updating the video', err);
                            res.json({
                                error: 'There was an error updating the video'
                            });
                        });
                } else {
                    res.status(404);
                    res.json({ error: 'Video doesnn\'t exist' });
                }
            })
            .catch((err) => {
                res.status(500);
                console.log('error while querying the video', err);
                res.json({ error: 'There was an error' });
            });
    } else {
        res.status(422);
        res.json({ error: 'No valis ID provide for the video' });
    }
};

const deleteVideo = (req, res) => {
    if (req.query && req.query.id) {
        videoModel.findByIdAndDelete(req.query.id)
            .then(video => {
                if (video) {
                    res.json({ message: 'Video successfully deleted' });
                } else {
                    res.status(404);
                    res.json({ error: 'Video doesn\'t exist' });
                }
            })
            .catch((err) => {
                res.status(500)
                console.log('error while querying the video', err);
                res.json({ error: 'there was an error' });
            });
    } else {
        res.status(422);
        res.json({ error: 'No valid ID provided for playlist' });
    }
};

module.exports = {
    createVideo,
    getVideo,
    updateVideo,
    deleteVideo
};