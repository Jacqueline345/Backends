const usuarioModel = require("../model/usuarioModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUsuarios() {
    let usuario = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        telefono: document.getElementById('telefono').value,
        correos: document.getElementById('correos').value,
        nacimiento: document.getElementById('nacimiento').value,
        pais: document.getElementById('pais').value,
        contraseña: document.getElementById('contraseña').value,
        pin: document.getElementById('pin').value,
    }
    const response = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarios)
    });

    if (response && response.status == 201) {
        usuario = await response.json();
        console.log('User saved', usuario);
        alert('Usuario guardado');
    } else {
        alert("Shit's on fire!");
    }
}

// Registro de usuario
async function registerUsuario(req, res) {
    try {
        const { nombre, apellidos, telefono, correos, nacimiento, pais, contraseña, pin } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const usuario = new usuarioModel({ nombre, apellidos, telefono, correos, nacimiento, pais, contraseña: hashedPassword, pin });
        await usuario.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
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

document.getElementById('registerForm').addEventListener('submit', function (event) {
    const birthdate = document.getElementById('nacimiento').value;

    // Validación en el frontend
    if (!isAdult(nacimiento)) {
        event.preventDefault();
        alert('Debes ser mayor de 18 años para registrarte.');
    }
});

//Inicio sesión
async function loginUsuario(req, res) {
    const { correo, contraseña } = req.body;
    const usuario = await usuarioModel.findOne({ correos: correo });
    if (!usuario) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const isMatch = contraseña == usuario.contraseña;
    if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: usuario._id }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login exitoso', token });
}

// Cierre de sesión
function logoutUsuario(req, res) {
    res.status(200).json({ message: 'Logout exitoso' });
}

module.exports = {
    loginUsuario,
    createUsuarios,
    registerUsuario,
    logoutUsuario
};
