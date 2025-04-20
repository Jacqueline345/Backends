// resolvers.js
const Usuario = require('./model/usuarioModel'); 

const resolvers = {
    getUsuarios: async () => {
        return await Usuario.find();
    },
    createUsuarios: async ({ nombre, apellidos, telefono, correos, nacimiento, pais, contrasena, pin }) => {
        const nuevoUsuario = new Usuario({
            nombre,
            apellidos,
            telefono,
            correos,
            nacimiento: new Date(nacimiento),
            pais,
            contrasena,
            pin
        });
        return await nuevoUsuario.save();
    }
};

module.exports = resolvers;