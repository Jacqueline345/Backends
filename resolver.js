// resolvers.js
const { Token } = require('graphql');
const Usuario = require('./model/usuarioModel'); 
const {verificarCuenta} = require('./controllers/usuarioController');

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
    },
    //Mutación para verificar cuenta
    verifyAccount: async(_, { token }) => {
        try {
            await verificarCuenta(token);
            return { success: true, message: "Correo de verificación enviado con éxito"};
        } catch (error){
            return { success: false, message: "Error al verificar la cuenta:  " + error.message};
        }
    }
};

module.exports = resolvers;