const { gql } = require('apollo-server-express');
const typeDefs = gql`
    type Query {
        getAllUsers: [usuarios]
        getUserById(id: ID!): usuarios
    }
    type usuarios {
        nombre: String,
        apellidos: String,
        telefono: Int,
        correos: String,
        nacimiento: String,
        pais: String,
        contrasena: String,
        pin: String,
        estado: String
    }
`;
module.exports = typeDefs;