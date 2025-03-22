const Usuario = require('./model/usuarioModel'); // Asegúrate de ajustar la ruta
const playlistModel = require('./model/playlist');
const express = require('express');
const app = express();
const path = require('path');
// database connection
const mongoose = require("mongoose");

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
const { usuariosCreate, usuariosGet, UsuarioUpdate, deleteUsuario, } = require('./controllers/usuarioController');
const { loginUsuario, logoutUsuario, validateAdminPin } = require('./controllers/authController');
const usuarioModel = require('./model/usuarioModel');
const { restringidoCreate, restringidoGet, restringidoUpdate, restringidoDelete } = require('./controllers/restringidoController');
const restringidoModel = require('./model/restringidoModel');
const { playlistCreate, playlistGet, playlistUpdate, playlistDelete } = require('./controllers/playlistController');
const playlist = require('./model/playlist');

app.post('/usuarios', usuariosCreate);
app.get('/usuarios', usuariosGet);
app.patch('/usuarios', UsuarioUpdate);
app.delete('/usuarios', deleteUsuario);
app.post('/login', loginUsuario);
app.post('/logout', logoutUsuario);
// Ruta de validación
app.post('/validar', async (req, res) => {
  const { pin } = req.body;

  try {
    // Buscamos el usuario por su id
    const user = await usuarioModel.findOne({ pin });

    if (user && user.pin === pin) {
      res.status(200).json({ message: 'Autenticación exitosa' });
    } else {
      res.status(401).json({ message: 'PIN incorrecto o usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
app.post('/restringido', restringidoCreate);
app.get('/restringido', restringidoGet);
app.patch('/restringido', restringidoUpdate);
app.delete('/restringido', restringidoDelete);

// Servir imágenes estáticas desde la carpeta 'img'
app.use("/img", express.static(path.join(__dirname, "img")));

app.delete('/restringido/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Verificar que el ID tenga el formato correcto de MongoDB
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "ID inválido" });
      }

      const result = await restringidoModel.findByIdAndDelete(id);

      if (!result) {
          return res.status(404).json({ message: "Registro no encontrado" });
      }

      res.json({ message: "Eliminado correctamente" });
  } catch (error) {
      console.error("Error al eliminar:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get('/restringido/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Verifica si el ID tiene el formato correcto (24 caracteres hexadecimales)
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "ID inválido" });
      }

      const usuario = await restringidoModel.findById(id);

      if (!usuario) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(usuario); // Enviar el usuario como respuesta

  } catch (error) {
      console.error("Error al buscar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.put('/restringido/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    const updatedData = req.body; // Los datos que se enviaron en el cuerpo de la solicitud

    // Verifica si el ID tiene el formato correcto (24 caracteres hexadecimales)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Busca el usuario en la base de datos por su ID
    const usuario = await restringidoModel.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza los datos del usuario con los nuevos datos
    Object.assign(usuario, updatedData);  // Usamos los nuevos datos

    // Guarda los cambios en la base de datos
    await usuario.save();  // Guarda el usuario con los datos actualizados

    // Devuelve la respuesta con el usuario actualizado
    res.status(200).json(usuario);

  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});
app.post('/playlist', playlistCreate);
app.get('/playlist', playlistGet);
app.patch('/playlist', playlistUpdate);
app.delete('/playlist', playlistDelete);

app.delete('/playlist/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Verificar que el ID tenga el formato correcto de MongoDB
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "ID inválido" });
      }

      const result = await playlistModel.findByIdAndDelete(id);

      if (!result) {
          return res.status(404).json({ message: "Playlist no encontrado" });
      }

      res.json({ message: "Eliminado correctamente" });
  } catch (error) {
      console.error("Error al eliminar:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get('/playlist/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Verifica si el ID tiene el formato correcto (24 caracteres hexadecimales)
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "ID inválido" });
      }

      const play = await playlistModel.findById(id);

      if (!play) {
          return res.status(404).json({ message: "Playlist no encontrado" });
      }

      res.json(play); // Enviar el playlist como respuesta

  } catch (error) {
      console.error("Error al buscar el playlist:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.put('/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    const updatedData = req.body; // Los datos que se enviaron en el cuerpo de la solicitud

    // Verifica si el ID tiene el formato correcto (24 caracteres hexadecimales)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Busca el playlist en la base de datos por su ID
    const play = await playlistModel.findById(id);
    if (!play) {
      return res.status(404).json({ message: "play no encontrado" });
    }

    // Actualiza los datos del playlist con los nuevos datos
    Object.assign(play, updatedData);  // Usamos los nuevos datos

    // Guarda los cambios en la base de datos
    await play.save();  // Guarda el playlist con los datos actualizados

    // Devuelve la respuesta con el playlist actualizado
    res.status(200).json(play);

  } catch (error) {
    console.error("Error al actualizar el playlist:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.listen(3001, () => console.log(`Example app listening on port 3001!`))
