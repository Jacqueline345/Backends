async function createUsuarios() {
    let usuarios = {
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
        usuarios = await response.json();
        console.log('User saved', usuarios);
        alert('Usuario guardado');
    } else {
        alert("Shit's on fire!");
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

document.getElementById('registerForm').addEventListener('submit', function(event) {
    const birthdate = document.getElementById('nacimiento').value;

    // Validación en el frontend
    if (!isAdult(nacimiento)) {
        event.preventDefault();
        alert('Debes ser mayor de 18 años para registrarte.');
    }
});

