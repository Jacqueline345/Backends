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
    usuarios.nacimiento = req.body.nacimiento;
    usuarios.pais = req.body.pais;
    usuarios.contraseña = req.body.contraseña;
    usuarios.pin = req.body.pin;

    if (!moment(nacimiento, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ mensaje: "Formato de fecha inválido, usa 'YYYY-MM-DD'" });
    }

    // Verificar si el usuario es mayor de 18 años
    const edad = moment().diff(moment(nacimiento, 'YYYY-MM-DD'), 'years');
    if (edad < 18) {
        return res.status(400).json({ mensaje: "Debes ser mayor de 18 años para registrarte." });
    }

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