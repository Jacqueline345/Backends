// Obtener el ID desde la URL
function obtenerIDDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Extrae el ID del query string
    return id;
}

// Cargar datos del usuario y rellenar los inputs
async function cargarDatosUsuario() {
    const id = obtenerIDDesdeURL();
    try {
        const response = await fetch(`http://localhost:3001/restringido/${id}`);
        const usuario = await response.json();

        console.log("Datos recibidos del usuario:", usuario); // Verifica la respuesta de la API

        if (!response.ok) {
            throw new Error(usuario.message);
        }

        // Verificar que los elementos existen antes de asignar valores
        document.getElementById('nombre_completo').value = usuario.nombre_completo || "";
        document.getElementById('numero').value = usuario.numero || "";
        document.getElementById('edad').value = usuario.edad || "";  
        document.getElementById('pin').value = usuario.pin || "";  
        document.getElementById('avatar').src = `http://localhost:3001${usuario.avatar}` || "";
        document.getElementById('editId').value = usuario._id || ""; // Guardar el ID oculto

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosUsuario);