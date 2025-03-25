async function videosPost() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = document.getElementById('playlistId').value; // Captura el valor del input

    // Create the videos object
    let videos = {
        videoId: document.getElementById('video-id').value,
        title: document.getElementById('video-title').value,
        url: document.getElementById('video-url').value,
        description: document.getElementById('video-description').value,
        playlistId: playlistId // Assign the playlistId to the videos object
    };

    try {
        const response = await fetch("http://localhost:3001/videos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(videos)
        });

        if (response.ok) { // Check if the response is successful
            const savedVideo = await response.json();
            console.log('Videos guardados', savedVideo);
            alert('Videos guardado');
            window.location.href = "video.html";  // Redirect to the desired URL
        } else {
            alert("Error al guardar el video. Código de estado: " + response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert("Ocurrió un error al intentar guardar el video.");
    }
}

async function playlistGet() {
    const response = await fetch("http://localhost:3001/playlist");
    const playlists = await response.json();
    console.log('playlists', playlists); // Verifica la respuesta aquí

    if (playlists) {
        const container = document.getElementById('result');
        container.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos elementos
        playlists.forEach(element => {
            const item = document.createElement('li');
            item.innerHTML = `
                <td>${element.nombre_playlist}</td> <!-- Columna para el nombre del playlist -->
                <td>${element.videoCount !== undefined ? element.videoCount : 0} videos</td> <!-- Columna para la cantidad de videos -->
                <td> <!-- Columna para las acciones -->
                    <a href="#" class="select_button" data-id="${element._id}">Seleccionar</a>
                </td>
            `;
            item.setAttribute('data-id', element._id);
            container.appendChild(item);
        });

        assignSelectEvents(); // Asegúrate de que esta función esté definida
    }
}

function assignSelectEvents() {
    document.querySelectorAll('.select_button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const playlistId = e.target.getAttribute('data-id'); // Obtiene el ID de la playlist
            console.log(`Seleccionado: ${playlistId}`);
            
            window.location.href = `agregarVideo.html?id=${playlistId}`; // Cambia 'agregar_video.html' por la ruta correcta

        });
    });
}
function showAddVideoForm(playlistId) {
    // Verifica que los elementos existan en el DOM
    const videoIdInput = document.getElementById('video-id');
    const videoTitleInput = document.getElementById('video-title');
    const videoUrlInput = document.getElementById('video-url');
    const videoDescriptionInput = document.getElementById('video-description');
    const playlistIdInput = document.getElementById('playlist-id');

    if (videoIdInput && videoTitleInput && videoUrlInput && videoDescriptionInput && playlistIdInput) {
        // Limpia los campos del formulario
        videoIdInput.value = ''; // Limpia el campo de ID
        videoTitleInput.value = ''; // Limpia el campo de título
        videoUrlInput.value = ''; // Limpia el campo de URL
        videoDescriptionInput.value = ''; // Limpia el campo de descripción
        playlistIdInput.value = playlistId; // Establece el ID de la playlist seleccionada

        // Muestra el modal
        const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
        videoModal.show();
    } 
}
// Obtener el ID desde la URL
function obtenerIDDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Extrae el ID del query string
    console.log("URL actual:", window.location.href); // Muestra la URL actual
    console.log("ID obtenido:", id); // Muestra el ID obtenido
    return id;
}

async function cargarDatosUsuario() {
    const id = obtenerIDDesdeURL();
    console.log("ID obtenido de la URL:", id); // Agrega este log para depuración
    if (!id) {
        console.error("No se encontró un ID en la URL.");
        return; // Salir si no hay ID
    }
    try {
        const response = await fetch(`http://localhost:3001/playlist/${id}`);
        const usuario = await response.json();

        console.log("Datos recibidos del usuario:", usuario); // Verifica la respuesta de la API

        if (!response.ok) {
            throw new Error(usuario.message);
        }
        document.getElementById('playlistId').value = usuario._id || ""; // Asigna el ID de la playlist al campo correspondiente

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosUsuario);