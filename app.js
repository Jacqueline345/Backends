require('dotenv').config(); // Cargar variables de entorno desde .env
const cors = require('cors');
const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');
const mongoose = require('mongoose');
const schema = require('./graphql-schema'); // Importar el esquema GraphQL
//const resolvers = require('./resolver'); // Importar los resolvers

// Conectar a MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

const {
    usuariosGet, usuariosCreate
} = require('./controllers/usuarioController');


// Resolvers
const root = {
    getUsuarios: async () => {
        const usuarios = await usuariosGet();
        return usuarios;
    },
    createUsuarios: async (args) => {
        const { nombre, apellidos, telefono, correos, nacimiento, pais, contrasena, pin } = args;
        console.log(args);
        const usuario = await usuariosCreate({ nombre, apellidos, telefono, correos, nacimiento, pais, contrasena, pin });
        return usuario;
    },
}

const app = express();
app.use(cors()); // Habilitar CORS

// Endpoint para consultas GraphQL (POST o GET con query string)
app.all('/graphql', createHandler({
    schema: schema,
    rootValue: root
}));

// Ruru: interfaz visual para probar GraphQL
app.get('/', (req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
});

// Servidor
app.listen(4000, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});
