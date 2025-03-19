const restringidos = require('../model/restringidoModel');

/**
 * Creates a user restringido
 * 
 * @param {*} req
 * @param {*} res
 */
const restringidoCreate = (req, res) => {
    let restringido = new restringidos();

    restringido.nombre_completo = req.body.nombre_completo;
    restringido.numero = req.body.numero;
    restringido.edad = req.body.edad;
    restringido.pin = req.body.pin;
    restringido.avatar = req.body.avatar;

    if(restringido.nombre_completo) {
        restringido.save()
        .then(() => {
            res.status(201);
            res.header({
                'location': `/restringidos/?id=${restringido.id}`
            });
            res.json(restringido);
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

/**
 * Get all users
 * @param {*} req 
 * @param {*} res 
 */
const restringidoGet = (req, res) => {
    const id = req.params.id;

    if (id) {
        // Obtener un restringido por ID
        restringidos.findById(id)
            .then((restringido) => {
                if (!restringido) {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                } else {
                    res.json(restringido);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener el usuario' });
                console.log('Error al obtener el usuario:', err);
            });
    } else {
        // Obtener todos los usuarios restringidos
        restringidos.find()
            .then((restringido) => {
                if (restringido.length === 0) {
                    res.status(404).json({ message: 'No se encontraron usuarios restringidos' });
                } else {
                    res.json(restringido);
                }
            })
            .catch((err) => {
                res.status(422).json({ error: 'Error al obtener los usuarios restringidos' });
                console.log('Error al obtener los usuarios restringidos:', err);
            });
    }
}
/**
 * Updates a usuarios
 *
 * @param {*} req
 * @param {*} res
 */

const restringidoUpdate = (req, res) => {
    if (req.query && req.query.id) {
        restringidos.findById(req.query.id)
            .then(restringido => {
                if (restringido) {
                    // Update the usuarios fields
                    restringido.nombre_completo = req.body.nombre_completo || restringido.nombre_completo;
                    restringido.numero = req.body.numero || restringido.numero;
                    restringido.edad = req.body.edad || restringido.edad;
                    restringido.pin = req.body.pin || restringido.pin;
                    restringido.avatar = req.body.avatar || restringido.avatar;
                    restringido.save()
                        .then(() => {
                            res.json(restringido);
                        })
                        .catch((err) => {
                            res.status(422);
                            console.log('error while updating the users', err);
                            res.json({
                                error: 'There was an error updating the users'
                            });
                        });
                } else {
                    res.status(404);
                    res.json({ error: 'User doesn\'t exist' });
                }
            })
            .catch((err) => {
                res.status(500);
                console.log('error while querying the user', err);
                res.json({ error: 'There was an error' });
            });
    } else {
        res.status(422);
        res.json({ error: 'No valid ID provided for user' });
    }
};

/**
 * Deletes a usuario
 *
 * @param {*} req
 * @param {*} res
 */
const restringidoDelete = (req, res) => {
    if (req.query && req.query.id) {
        restringidos.findByIdAndDelete(req.query.id)
            .then(restringido => {
                if (restringido) {
                    res.json({ message: 'User successfully deleted' });
                } else {
                    res.status(404);
                    res.json({ error: 'User doesn\'t exist' });
                }
            })
            .catch((err) => {
                res.status(500);
                console.log('error while querying the user', err);
                res.json({ error: 'There was an error' });
            });
    } else {
        res.status(422);
        res.json({ error: 'No valid ID provided for user' });
    }
};

module.exports = {
    restringidoCreate,
    restringidoGet,
    restringidoUpdate,
    restringidoDelete
};