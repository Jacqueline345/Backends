const Usuarios = require('../model/usuarioModel');

/**
 * Creates a user
 * 
 * @param {*} req
 * @param {*} res
 */
const usuariosCreate = (req, res) => {
    let usuarios = new Usuarios();

    usuarios.nombre = req.body.nombre;
    usuarios.apellidos = req.body.apellidos;
    usuarios.telefono = req.body.telefono;
    usuarios.correos = req.body.correos;
    usuarios.nacimiento = new Date(req.body.nacimiento);
    usuarios.pais = req.body.pais;
    usuarios.contraseña = req.body.contraseña;
    usuarios.pin = req.body.pin;

    if (!isAdult(usuarios.nacimiento)) {
        return res.status(400).json({ message: 'Debes ser mayor de 18 años para registrarte.' });
    } else {
        if (usuarios.nombre && usuarios.apellidos) {
            usuarios.save()
                .then(() => {
                    res.status(201);
                    res.header({
                        'location': `/usuarios/?id=${usuarios.id}`
                    });
                    res.json(usuarios);
                })
                .catch((err) => {
                    res.status(422);
                    console.log('error while saving the user', err);
                    res.json({
                        error: 'There was an error saving the user'
                    });
                });
        } else {
            res.status(422);
            console.log('error while saving the user')
            res.json({
                error: 'No valid data provided for user'
            });
        }
    }
}


function isAdult(nacimiento) {
    const today = new Date();
    const birthDate = new Date(nacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
}

/**
 * Get all users
 * @param {*} req 
 * @param {*} res 
 */
const usuariosGet = (req, res) => {
    const id = req.params.id;

    if (id) {
        // Obtener un usuario por ID
        Usuarios.findById(id)
            .then((usuario) => {
                if (!usuario) {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                } else {
                    res.json(usuario);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener el usuario' });
                console.log('Error al obtener el usuario:', err);
            });
    } else {
        // Obtener todos los usuarios
        Usuarios.find()
            .then((usuarios) => {
                if (usuarios.length === 0) {
                    res.status(404).json({ message: 'No se encontraron usuarios' });
                } else {
                    res.json(usuarios);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener los usuarios' });
                console.log('Error al obtener los usuarios:', err);
            });
    }
}

module.exports = {
    usuariosCreate,
    usuariosGet
};