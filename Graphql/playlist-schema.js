const { gql } = require('apollo-server-express');
const playlist = gql`
    type Query {
        getAllPlaylist: [playlist],
    }
    type playlist {
        nombre_playlist: String,
        perfiles_asociados: String,
    }
`;
module.exports = playlist;