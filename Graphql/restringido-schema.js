const { gql } = require('apollo-server-express');
const rest = gql`
    type Query {
        getAllRestringidos: [restringidos],
    }
    type restringidos {
        nombre_completo: String,
        numero: Int,
        edad: Int,
        pin: String,
        avatar: String,
    }
`;
module.exports = rest;