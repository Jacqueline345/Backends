// resolvers.js
const Usuario = require('./model/usuarioModel');

const resolvers = {
    Query: {
      getAllUsers: async () => {
        const usuarios = await Usuario.find();
        return usuarios.map(u => ({
          ...u._doc,
          nacimiento: u.nacimiento.toISOString(), // Convertir a ISO
        }));
      },
  
      getUserById: async (_, { id }) => {
        const usuario = await Usuario.findById(id);
        if (!usuario) return null;
        return {
          ...usuario._doc,
          nacimiento: usuario.nacimiento.toISOString(), // Convertir a ISO
        };
      }
    }
  };
  
  module.exports = resolvers;
  