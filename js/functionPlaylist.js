async function playlistPost() {
    let playlist = {
        nombre_playlist: document.getElementById('nombre_playlist').value,
        perfiles_asociados: document.getElementById('perfiles_asociados').value
    }
    const response = await fetch("http://localhost:3001/playlist", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist)
    });

    if (response && response.status == 201) {
        playlist = await response.json();
        console.log('Playlist guardado', playlist);
        alert('Playlist guardado');
        window.location.href = "playlist.html";  // Aquí va la URL a la que deseas redirigir

    } else {
        alert("Shit's on fire");
    }
}
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
            window.location.href = `editPlaylist.html?id=${id}`;

        });
    });
}

async function playGet() {
    const response = await fetch("http://localhost:3001/playlist");
    const playlist = await response.json();
    console.log('playlist', playlist);

    if (playlist) {
        const container = document.getElementById('result');
        container.innerHTML = '';
        playlist.forEach(element => {
            const item = document.createElement('li');
            item.innerHTML = `
            <td>${element.nombre_playlist}</td> <!-- Columna para el nombre del playlist -->
            <td>${element.videoCount !== undefined ? element.videoCount : 0} videos</td> <!-- Columna para la cantidad de videos -->
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
                    const response = await fetch(`http://localhost:3001/playlist/${id}`, {
                        method: 'DELETE'
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Registro eliminado');
                        playGet(); // Recargar la lista
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

async function usuariosGet() {
    const response = await fetch("http://localhost:3001/restringido");
    const restringidos = await response.json();
    console.log('restringidos', restringidos);

    if (restringidos) {
        const container = document.getElementById('result');
        container.innerHTML = '';
        restringidos.forEach(element => {
            const item = document.createElement('li');
            item.innerHTML = `
                ${element.nombre_completo} 
                <a href="#" class="select_button" data-id="${element._id}" data-nombre="${element.nombre_completo}">Select</a>
                `;
            item.setAttribute('data-id', element._id);
            container.appendChild(item)
        });

        assignSelectEvents();
    }
}
function assignSelectEvents() {
    document.querySelectorAll('.select_button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const nombre = e.target.getAttribute('data-nombre'); // Obtiene el nombre
            const perfilInput = document.getElementById('perfiles_asociados');
            perfilInput.value = nombre; // Pone el nombre en el input
            console.log(`Seleccionado: ${nombre}`);
        });
    });
}
// Obtener el ID desde la URL
function obtenerIDDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Extrae el ID del query string
    return id;
}

// Cargar datos del usuario y rellenar los inputs
async function cargarDatos() {
    const id = obtenerIDDesdeURL();

    try {
        const response = await fetch(`http://localhost:3001/playlist/${id}`);
        const play = await response.json();

        console.log("Datos recibidos del playlist:", play); // Verifica la respuesta de la API

        if (!response.ok) {
            throw new Error(play.message);
        }

        // Verificar que los elementos existen antes de asignar valores
        document.getElementById('nombre_playlist').value = play.nombre_playlist || "";
        document.getElementById('perfiles_asociados').value = play.perfiles_asociados || "";

        document.getElementById('editId').value = play._id || ""; // Guardar el ID oculto

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatos);


async function playlistUpdate() {
    let playlist = {
        nombre_playlist: document.getElementById('nombre_playlist').value,
        perfiles_asociados: document.getElementById('perfiles_asociados').value
    }

    const id = document.getElementById('editId').value; // Obtener el ID del campo oculto
    try {
        const response = await fetch(`http://localhost:3001/playlist/${id}`, { // Pasar el ID en la URL
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlist)
        });

        if (response.ok) {
            const updatedPlay = await response.json();
            console.log('Playlist actualizado', updatedPlay);
            alert('Playlist actualizado correctamente');
            window.location.href = "playlist.html";  // Aquí va la URL a la que deseas redirigir

        } else {
            const errorMessage = await response.text();
        }
    } catch (error) {
        console.error('Error al actualizar la playlist:', error);
    }
}

module.exports = {
    playlistPost,
    playGet,
    usuariosGet,
    playlistUpdate
};

