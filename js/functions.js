const usuarioModel = require("../model/usuarioModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function assignEditEvents() {
    document.querySelectorAll('.edit_button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evita la recarga de la página

            const id = button.getAttribute('data-id'); // Obtener el ID del atributo correcto

            if (!id) {
                console.error("No se encontró el ID en el botón de edición.");
                return;
            }

            console.log("Redirigiendo con ID:", id); // Verifica que el ID se obtiene correctamente
            window.location.href = `actualizarRestringido.html?id=${id}`;
        });
    });
}




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
async function restringidoPost() {
    let restringido = {
        nombre_completo: document.getElementById('nombre_completo').value,
        numero: document.getElementById('numero').value,
        edad: document.getElementById('edad').value,
        pin: document.getElementById('pin').value,
        avatar: document.getElementById('avatar').value
    }
    const response = await fetch("http://localhost:3001/restringido", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(restringido)
    });

    if (response && response.status == 201) {
        restringido = await response.json();
        console.log('Usuario restringido guardado', restringido);
        alert('Usuario restringido guardado');
        window.location.href = "restringido.html";  // Aquí va la URL a la que deseas redirigir

    } else {
        alert("Shit's on fire");
    }
}

async function restringidoGet() {
    const response = await fetch("http://localhost:3001/restringido");
    const restringido = await response.json();
    console.log('restringidos', restringido);

    if (restringido) {
        const container = document.getElementById('result');
        container.innerHTML = '';
        restringido.forEach(element => {
            const item = document.createElement('li');
            item.innerHTML = `
            <td><img src="http://localhost:3001${element.avatar}" alt="Avatar" width="50" height="50"></td> <!-- Columna para el avatar -->
            <td>${element.nombre_completo}</td> <!-- Columna para el nombre completo -->
            <td> <!-- Columna para las acciones -->
                <a href="#" class="edit_button" data-id="${element._id}">Edit</a>
                <a href="#" class="delete_button" data-id="${element._id}">Delete</a>
            </td>
        `;
            item.setAttribute('data-id', element._id);
            container.appendChild(item)
        });

        assignEditEvents();
        assignDeleteEvents();

    }
}

// Función para asignar eventos a los botones "Delete"
function assignDeleteEvents() {
    document.querySelectorAll('.delete_button').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const id = event.target.getAttribute('data-id');

            if (!id) {
                console.error("ID no encontrado");
                alert("Error: ID no encontrado.");
                return;
            }

            if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
                try {
                    const response = await fetch(`http://localhost:3001/restringido/${id}`, {
                        method: 'DELETE'
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Registro eliminado');
                        restringidoGet(); // Recargar la lista
                    } else {
                        console.error("Error en la respuesta del servidor:", result);
                        alert(`Error al eliminar: ${result.message || 'No se pudo eliminar'}`);
                    }
                } catch (error) {
                    console.error("Error en la petición DELETE:", error);
                    alert("Hubo un problema al conectar con el servidor.");
                }
            }
        });
    });
}

async function restringidoUpdate() {
    let restringido = {
        nombre_completo: document.getElementById('nombre_completo').value,
        numero: document.getElementById('numero').value,
        edad: document.getElementById('edad').value,
        pin: document.getElementById('pin').value,
        avatar: document.getElementById('avatar').value // Obtener la URL de la imagen
    }

    const id = document.getElementById('editId').value; // Obtener el ID del campo oculto

    if (!id) {
        alert("No se encontró el ID del usuario.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/restringido/${id}`, { // Pasar el ID en la URL
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restringido)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            console.log('Usuario actualizado', updatedUser);
            alert('Usuario actualizado correctamente');
            window.location.href = "restringido.html";  // Aquí va la URL a la que deseas redirigir

        } else {
            const errorMessage = await response.text();
            alert(`Hubo un problema al actualizar el usuario: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario');
    }
}


module.exports = {
    loginUsuario,
    createUsuarios,
    registerUsuario,
    logoutUsuario,
    restringidoGet,
    restringidoPost,
    restringidoUpdate
};
