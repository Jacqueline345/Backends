// Función que se ejecuta al hacer clic en una imagen de avatar
function selectAvatar(avatarUrl) {
    console.log("Avatar seleccionado:", avatarUrl);  // Esto te ayudará a ver si la función se ejecuta

    // Actualiza el valor del campo oculto con la URL del avatar seleccionado
    document.getElementById('avatar').value = avatarUrl;

    // Opcional: puedes cambiar el estilo visual de la imagen seleccionada
    const images = document.querySelectorAll('.avatar-img');
    images.forEach(img => {
        img.style.border = ''; // Quitar el borde de todas las imágenes
    });

    // Poner un borde en la imagen seleccionada (opcional para feedback visual)
    const selectedImage = [...images].find(img => img.src === avatarUrl);
    if (selectedImage) {
        selectedImage.style.border = '2px solid green'; // Resaltar la imagen seleccionada
    }
}