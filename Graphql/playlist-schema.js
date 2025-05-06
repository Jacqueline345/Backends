const { gql } = require('apollo-server-express');

const play = gql`
    type Query {
        getAllPlaylist: [playlist]
    }

    type playlist {
        nombre_playlist: String
        perfiles_asociados: String
    }
`;

module.exports = play;
