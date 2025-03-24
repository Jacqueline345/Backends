document.addEventListener("DOMContentLoaded", function () {
    loadVideos();
    document.getElementById('video-form').addEventListener('submit', saveVideo);
});

async function loadVideos() {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('playlistId');
    try {
        const response = await fetch(`http://localhost:3001/videos?playlistId=${playlistId}`);
        const videos = await response.json();

        const container = document.getElementById('videos-container');
        container.innerHTML = ''; // Limpiar contenedor

        videos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.classList.add('list-group-item', 'list-group-item-action');
            videoElement.innerHTML = `
                <h5 class="mb-1">${video.title}</h5>
                <iframe width="560" height="315" src="${video.url}" frameborder="0" allowfullscreen></iframe>
                <p class="mb-1">${video.description}</p>
                <button class="btn btn-warning btn-sm" onclick="editVideo('${video._id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteVideo('${video._id}')">Eliminar</button>
            `;
            container.appendChild(videoElement);
        });
    } catch (error) {
        console.error('Error al cargar los videos:', error);
    }
}

function showAddVideoForm() {
    console.log('Mostrar formulario');
    document.getElementById('video-id').value = '';
    document.getElementById('video-title').value = '';
    document.getElementById('video-url').value = '';
    document.getElementById('video-description').value = '';
    const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
    videoModal.show();
    document.getElementById('video-title').focus();
}

async function saveVideo(event) {
    event.preventDefault();
    const videoId = document.getElementById('video-id').value;
    const title = document.getElementById('video-title').value;
    const url = document.getElementById('video-url').value;
    const description = document.getElementById('video-description').value;
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('playlistId');

    const videoData = {
        title,
        url,
        description,
        playlistId
    };

    try {
        let response;
        if (videoId) {
            response = await fetch(`http://localhost:3001/videos/${videoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(videoData)
            });
        } else {
            response = await fetch('http://localhost:3001/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(videoData)
            });
        }

        if (response.ok) {
            loadVideos();
            const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
            videoModal.hide();
            window.location.href = "video.html";  // Aquí va la URL a la que deseas redirigir
        } else {
            console.error('Error al guardar el video');
        }
    } catch (error) {
        console.error('Error al guardar el video:', error);
    }
}

async function editVideo(videoId) {
    try {
        const response = await fetch(`http://localhost:3001/videos/${videoId}`);
        if (!response.ok) {
            throw new Error('Error al cargar el video');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const video = await response.json();
            document.getElementById('video-id').value = video._id;
            document.getElementById('video-title').value = video.title;
            document.getElementById('video-url').value = video.url;
            document.getElementById('video-description').value = video.description;

            const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
            videoModal.show();
        } else {
            throw new Error('Respuesta no es JSON');
        }
    } catch (error) {
        console.error('Error al cargar el video para editar:', error);
    }
}

async function deleteVideo(videoId) {
    try {
        const response = await fetch(`http://localhost:3001/videos/${videoId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadVideos();
        } else {
            console.error('Error al eliminar el video');
        }
    } catch (error) {
        console.error('Error al eliminar el video:', error);
    }
}
