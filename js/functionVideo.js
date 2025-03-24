// Función para convertir URL de YouTube a formato embed
function convertToEmbedUrl(url) {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
        return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
}

module.exports = { convertToEmbedUrl };