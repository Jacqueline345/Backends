const { gql } = require('apollo-server-express');
const vid = gql`
    type Query {
        getAllVideos: [videos]
        searchVideos(title: String): [videos]
    }
    type videos {
        title: String,
        url: String,
        description: String,
        playlistId: ID
    }
`;
module.exports = vid;