async function videosPost() {
    let videos = {
        title: document.getElementById('video-title').value,
        url: document.getElementById('video-url').value,
        description: document.getElementById('video-description').value
    }
    const response = await fetch("http://localhost:3001/videos", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(videos)
    });

    if (response && response.status == 201) {
        videos = await response.json();
        console.log('video guardado', videos);
        alert('video guardado');
        window.location.href = "video.html";  // Aquí va la URL a la que deseas redirigir

    } else {
        alert("Shit's on fire");
    }
}
module.exports = {
    videosPost
};
