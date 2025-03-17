const Usuario = require('./model/usuarioModel'); // Asegúrate de ajustar la ruta
const express = require('express');
const app = express();
const path = require('path');
// database connection
const mongoose = require("mongoose");
const authRoutes = require('./auth');

mongoose.connect("mongodb://127.0.0.1:27017/usuarios", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/login', authRoutes);
const { usuariosCreate, usuariosGet, UsuarioUpdate, deleteUsuario, } = require('./controllers/usuarioController');
const { loginUsuario, logoutUsuario } = require('./controllers/authController');

app.post('/usuarios', usuariosCreate);
app.get('/usuarios', usuariosGet);
app.patch('/usuarios', UsuarioUpdate);
app.delete('/usuarios', deleteUsuario);
app.post('/login', loginUsuario);
app.post('/logout', logoutUsuario);

app.listen(3001, () => console.log(`Example app listening on port 3001!`))
