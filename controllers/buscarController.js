const Busqueda = require('../model/buscarModel');

/**
 * Buscar Videos
 * @param {*} req 
 * @param {*} res 
 */
const buscarVideos = async (req, res) => {
    try {
        const { query, playlistId } = req.query;
        const videos = await Busqueda.find({
            playlistId,
            $or: [
                {title: {$regex: query, $options:  'i' }},
                { description: {$regex: query, $options: 'i' }}
            ]
        });
        res.json(videos);
    }catch (error){
        res.status(500).json({message: 'Error al buscar videos', error});
    }
};

module.exports = {
    buscarVideos
}