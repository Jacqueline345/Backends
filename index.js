const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/usuarios");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));
const { createUsuarios} = require('./controllers/teacherController');

app.post('/usuarios', createUsuarios);
//app.get("/teachers",teacherGet);
//app.put('/teachers', teacherUpdate);
//app.delete('/teachers', deleteTeacher);


app.listen(3001, () => console.log(`Example app listening on port 3001!`))
