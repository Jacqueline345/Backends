// Obtener el ID desde la URL
function obtenerIDDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Extrae el ID del query string
    console.log("ID obtenido desde la URL:", id); // Verificar que el ID se obtiene correctamente
    return id;
}

// Cargar datos del usuario y rellenar los inputs
async function cargarDatosUsuario() {
    const id = obtenerIDDesdeURL();
    if (!id) {
        alert("No se encontró el ID del usuario en la URL.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/restringido/${id}`);
        const usuario = await response.json();

        console.log("Datos recibidos del usuario:", usuario); // Verifica la respuesta de la API

        if (!response.ok) {
            throw new Error(usuario.message || "Error al obtener los datos.");
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
        alert("Error al cargar los datos del usuario.");
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosUsuario);
ñ