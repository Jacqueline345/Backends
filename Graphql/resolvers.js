const { get } = require('mongoose');
const Usuario = require('./model/usuarioModel');
const playlist = require('./model/playlist');
const videoModel = require('./model/videoModel');
const restringido = require('./model/restringidoModel');


const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        // Obtener todos los usuarios
        const usuarios = await Usuario.find();;

        // Devolver los usuarios con el campo nacimiento convertido a ISO si existe
        return usuarios.map(u => {
          const usuario = u.toObject(); // Convertir el documento a un objeto plano
          if (usuario.nacimiento) {
            usuario.nacimiento = usuario.nacimiento.toISOString(); // Convertir a ISO
          }
          return usuario;
        });
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw new Error('No se pudieron obtener los usuarios');
      }
    },

    getUserById: async (_, { id }) => {
      try {
        // Obtener un usuario por ID
        const usuario = await Usuario.findById(id);

        // Si no existe el usuario, retornar null
        if (!usuario) return null;

        // Convertir el documento a un objeto plano y formatear la fecha
        const userObj = usuario.toObject();
        if (userObj.nacimiento) {
          userObj.nacimiento = userObj.nacimiento.toISOString();
        }

        return userObj;
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw new Error('No se pudo obtener el usuario');
      }
    },
    getAllPlaylists: async () => {
      try {
        // Obtener todas las playlist
        const playlists = await playlist.find();;
        return playlists;
      } catch (error) {
        console.error('Error al obtener las playlist:', error);
        throw new Error('No se pudieron obtener las playlist');
      }
    },
    getAllVideos: async () => {
      try {
        // Obtener todos los videos
        const videos = await videoModel.find();;
        return video;
      } catch (error) {
        console.error('Error al obtener los videos:', error);
        throw new Error('No se pudieron obtener los videos');
      }
    },
    getAllRestrigidos: async () => {
      try {
        // Obtener todos los restringidos
        const restringidos = await restringido.find();;
        return restringidos;
      } catch (error) {
        console.error('Error al obtener los restringidos:', error);
        throw new Error('No se pudieron obtener los restringidos');
      }
    },
  }
};

module.exports = resolvers;
