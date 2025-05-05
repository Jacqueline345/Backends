require('dotenv').config({ path: './Twilio/.env' }); // Carga el archivo .env desde la carpeta TWILIO
const Usuario = require('./model/usuarioModel'); // Asegúrate de ajustar la ruta
const playlistModel = require('./model/playlist');
const Video = require('./model/videoModel');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const sessión = require('express-session');
// Guardar esas variables en constantes
const path = require('path');
// database connection
const mongoose = require("mongoose");
const typeDefs = require('./graphql-schema'); // Importar el esquema GraphQL
const resolvers = require('./resolvers'); // Importar los resolvers
const app = express();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/enviar-codigo', (req, res) => {
  const telefono = req.session.telefono;

  if (!telefono) {
    return res.status(401).send({ success: false, message: 'Teléfono no encontrado en la sesión' });
  }

  const numeroConPrefijo = telefono.startsWith('+') ? telefono : '+506' + telefono;
  const codigo = Math.floor(100000 + Math.random() * 900000);

  client.messages.create({
    body: 'Tu código de verificación es: ' + codigo,
    to: numeroConPrefijo,
    from: '+15167155302'
  })
    .then((message) => {
      console.log('Código enviado:', codigo);
      res.status(200).send({ success: true });
    })
    .catch((error) => {
      console.error('Error al enviar código:', error);
      res.status(500).send({ success: false, error: error.message });
    });
});
app.get('/enviar-codigo', (req, res) => {
  res.send('Ruta GET de prueba para enviar código');
});

  const startServer = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/KidsTube", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => console.log("Conectado a MongoDB"))
      .catch(err => console.error("Error al conectar a MongoDB:", err));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await server.start();
    server.applyMiddleware({ app });
    // parser for the request body (required for the POST and PUT methods)
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(sessión({ secret: 'mi_secreto', resave: false, saveUninitialized: true }));


    // check for cors
    const cors = require("cors");
    app.use(cors({
      domains: '*',
      methods: "*"
    }));
    app.use(sessión({
      secret: 'mi_secreto',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false } // Cambia a true si usas HTTPS
    }));

    /*
    // Función para generar código
    function generarCodigo() {
      return Math.floor(100000 + Math.random() * 900000);
    }
  
    // Enviar código por Twilio
    async function enviarCodigoSMS(numero, codigo) {
     
      return twilio.messages.create({
        body: `Tu código de verificación es: ${codigo}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: +506+numero
      });
    }
  
    // Ruta de login
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const usuario = await Usuario.findOne({ email, password });
  
      if (!usuario) {
        return res.send('Credenciales incorrectas');
      }
  
      // Guardar ID en sesión
      req.session.userId = usuario._id;
  
      // Generar y guardar código
      const codigo = generarCodigo();
      req.session.codigo = codigo;
  
      // Enviar código por SMS
      try {
        await enviarCodigoSMS(usuario.telefono, codigo);
        console.log('Código enviado a:', usuario.telefono);
        res.redirect('/verificar-codigo.html');
      } catch (err) {
        console.error('Error al enviar SMS:', err);
        res.send('Error al enviar SMS');
      }
    });*/

    // Verificar código
    app.post('/verificar-codigo', (req, res) => {
      const { codigo } = req.body;

      if (codigo == req.session.codigo) {
        res.redirect('../Frontend/inicio.html');
      } else {
        res.send('Código incorrecto');
      }
    });


    /*
      // Ruta para verificar el código ingresado por el usuario
      app.post('/verificar-codigo', (req, res) => {
        const { codigo } = req.body;
        if (codigo === req.session.codigoVerificacion) {
            res.json({ message: 'Código verificado correctamente.' });
        } else {
            res.status(400).json({ message: 'Código incorrecto.' });
        }
    });*/


    // Configurar middleware
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('public'));

    // Servir archivos estáticos
    app.use(express.static(path.join(__dirname, '../Frontend')));
    const { usuariosCreate, usuariosGet, UsuarioUpdate, deleteUsuario, } = require('./controllers/usuarioController');
    const { loginUsuario, logoutUsuario, validateAdminPin } = require('./controllers/authController');
    const usuarioModel = require('./model/usuarioModel');
    const { restringidoCreate, restringidoGet, restringidoUpdate, restringidoDelete } = require('./controllers/restringidoController');
    const restringidoModel = require('./model/restringidoModel');
    const { playlistCreate, playlistGet, playlistUpdate, playlistDelete } = require('./controllers/playlistController');
    const { createVideo, updateVideo, deleteVideo, getVideo } = require('./controllers/videoController');
    const playlist = require('./model/playlist');
    const videoModel = require('./model/videoModel');

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

    //Rutas para gestionar videos
    app.post('/videos', createVideo);
    app.get('/videos', getVideo);
    app.patch('/videos', updateVideo);
    app.delete('/videos', deleteVideo);

    app.get('/videos/:id', async (req, res) => {
      const videoId = req.params.id;
      const video = await videoModel.findById(videoId); // Suponiendo que estás usando Mongoose

      if (!video) {
        return res.status(404).json({ message: 'Video no encontrado' });
      }

      res.json(video);
    });

    app.put('/videos/:id', async (req, res) => {
      try {
        const { id } = req.params; // Obtener el ID desde los parámetros de la URL
        const updatedData = req.body; // Los datos que se enviaron en el cuerpo de la solicitud

        // Verifica si el ID tiene el formato correcto (24 caracteres hexadecimales)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "ID inválido" });
        }

        // Busca el playlist en la base de datos por su ID
        const videos = await videoModel.findById(id);
        if (!videos) {
          return res.status(404).json({ message: "videos no encontrado" });
        }

        // Actualiza los datos del playlist con los nuevos datos
        Object.assign(videos, updatedData);  // Usamos los nuevos datos

        // Guarda los cambios en la base de datos
        await videos.save();  // Guarda el playlist con los datos actualizados

        // Devuelve la respuesta con el playlist actualizado
        res.status(200).json(videos);

      } catch (error) {
        console.error("Error al actualizar el playlist:", error);
        res.status(500).json({ message: "Error interno del servidor" });
      }
    });
    app.delete('/videos/:id', async (req, res) => {
      try {
        const { id } = req.params;

        // Verificar que el ID tenga el formato correcto de MongoDB
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "ID inválido" });
        }

        const result = await videoModel.findByIdAndDelete(id);

        if (!result) {
          return res.status(404).json({ message: "videos no encontrado" });
        }

        res.json({ message: "Eliminado correctamente" });
      } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ message: "Error interno del servidor" });
      }
    });

    // ruta para buscar videos
    app.get('/search-videos', async (req, res) => {
      const searchText = req.query.q.toLowerCase();
      try {
        const videos = await Video.find({
          $or: [
            { title: { $regex: searchText, $options: 'i' } },
            { description: { $regex: searchText, $options: 'i' } }
          ]
        });
        res.json(videos);
      } catch (error) {
        res.status(500).json({ error: 'Error al buscar videos' });
      }
    });

    app.get('/playlist', async (req, res) => {
      try {
        // Obtener todas las playlists
        const playlists = await playlistModel.find().lean();

        // Contar los videos asociados a cada playlist
        const playlistsWithVideoCount = await Promise.all(playlists.map(async (playlist) => {
          // Contar los videos que tienen el ID de la playlist
          const videoCount = await Video.countDocuments({ playlistId: playlist._id });
          return {
            ...playlist,
            videoCount // Agregar el conteo de videos a la playlist
          };
        }));

        // Devolver la lista de playlists con el conteo de videos
        res.json(playlistsWithVideoCount);
      } catch (error) {
        console.error(error); // Agregar un log para ver el error en la consola
        res.status(500).send({ error: 'Error al obtener las playlists' });
      }
    });

    //app.listen(3001, () => console.log(`Example app listening on port 3001!`))

    app.listen(3001, () => {
      console.log(`🚀 Servidor Express en http://localhost:3001`);
      console.log(`📡 Endpoint GraphQL en http://localhost:3001${server.graphqlPath}`);
    });
  };

  startServer();