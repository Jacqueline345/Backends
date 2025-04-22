const { buildSchema } = require('graphql');
const schema = buildSchema(`
    type Usuario {
        id: ID!
        nombre: String!
        apellidos: String!
        telefono: Int!
        correos: String!
        nacimiento: String!
        pais: String!
        contrasena: String!
        pin: Int!
        estado: String!
    }

    type VerifyResponse {
        success: Boolean!
        message: String!
    }

    input CreateUsuariosInput {
        nombre: String!
        apellidos: String!
        telefono: Int!
        correos: String!
        nacimiento: String!
        pais: String!
        contrasena: String!
        pin: Int!
    }

    type Query {
        getUsuarios: [Usuario]
    }

    type Mutation {
        createUsuarios(nombre: String!, apellidos: String!, telefono: Int!, correos: String!, nacimiento: String!, pais: String!, contrasena: String!, pin: Int!): Usuario

        verifyAccount(token: String!): VerifyResponse
    }
`);
module.exports = schema;