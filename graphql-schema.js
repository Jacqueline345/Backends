const {buildSchema} = require('graphql');
exports.schema = buildSchema(`
    type Usuario {
        id: ID!
        nombre: String!
        apellidos: String!
        telefono: String!
        correos: [String!]!
        nacimiento: String!
        pais: String!
        contrasena: String!
        pin: Int!
    }

    type Query {
        getUsuarios: [Usuario]
    }

    type Mutation {
        createUsuarios(nombre: String!, apellidos: String!, telefono: String!, correos: [String!]!, nacimiento: String!, pais: String!, contrasena: String!, pin: Int!): Usuario
    }
`);