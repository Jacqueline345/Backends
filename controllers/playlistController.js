const playlistModel = require('../Graphql/model/playlist');
/**
 * Creates a playlist
 * 
 * @param {*} req
 * @param {*} res
 */
const playlistCreate = (req, res) => {
    let playlist = new playlistModel();

    playlist.nombre_playlist = req.body.nombre_playlist;
    playlist.perfiles_asociados = req.body.perfiles_asociados;

    if (playlist.nombre_playlist) {
        playlist.save()
            .then(() => {
                res.status(201);
                res.header({
                    'location': `/playlist/?id=${playlist.id}`
                });
                res.json(playlist);
            })
            .catch((err) => {
                res.status(422);
                console.log('error while saving the playlist', err);
                res.json({
                    error: 'There was an error saving the playlist'
                });
            });
    } else {
        res.status(422);
        console.log('error while saving the playlist')
        res.json({
            error: 'No valid data provided for playlist'
        });
    }
}

/**
 * Get all users
 * @param {*} req 
 * @param {*} res 
 */
const playlistGet = (req, res) => {
    const id = req.params.id;

    if (id) {
        // Obtener un restringido por ID
        playlistModel.findById(id)
            .then((playlist) => {
                if (!playlist) {
                    res.status(404).json({ message: 'Playlist no encontrado' });
                } else {
                    res.json(playlist);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener el playlist' });
                console.log('Error al obtener el playlist:', err);
            });
    } else {
        // Obtener todas las playlist
        playlistModel.find()
            .then((playlist) => {
                if (playlist.length === 0) {
                    res.status(404).json({ message: 'No se encontraron la playlist' });
                } else {
                    res.json(playlist);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener la playlist' });
                console.log('Error al obtener la playlist:', err);
            });
    }
}
/**
 * Updates a usuarios
 *
 * @param {*} req
 * @param {*} res
 */

const playlistUpdate = (req, res) => {
    if (req.query && req.query.id) {
        playlistModel.findById(req.query.id)
            .then(playlist => {
                if (playlist) {
                    // Update the playlist fields
                    playlist.nombre_playlist = req.body.nombre_playlist || playlist.nombre_playlist;
                    playlist.perfiles_asociados = req.body.perfiles_asociados || playlist.perfiles_asociados;
                    playlist.save()
                        .then(() => {
                            res.json(playlist);
                        })
                        .catch((err) => {
                            res.status(422);
                            console.log('error while updating the playlist', err);
                            res.json({
                                error: 'There was an error updating the playlist'
                            });
                        });
                } else {
                    res.status(404);
                    res.json({ error: 'Playlist doesn\'t exist' });
                }
            })
            .catch((err) => {
                res.status(500);
                console.log('error while querying the playlist', err);
                res.json({ error: 'There was an error' });
            });
    } else {
        res.status(422);
        res.json({ error: 'No valid ID provided for playlist' });
    }
};

/**
 * Deletes a usuario
 *
 * @param {*} req
 * @param {*} res
 */
const playlistDelete = (req, res) => {
    if (req.query && req.query.id) {
        playlistModel.findByIdAndDelete(req.query.id)
            .then(playlist => {
                if (playlist) {
                    res.json({ message: 'Playlist successfully deleted' });
                } else {
                    res.status(404);
                    res.json({ error: 'Playlist doesn\'t exist' });
                }
            })
            .catch((err) => {
                res.status(500);
                console.log('error while querying the playlist', err);
                res.json({ error: 'There was an error' });
            });
    } else {
        res.status(422);
        res.json({ error: 'No valid ID provided for playlist' });
    }
};

module.exports = {
    playlistCreate,
    playlistGet,
    playlistUpdate,
    playlistDelete
};