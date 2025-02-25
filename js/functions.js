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

    const hoy = new Date();
    const nacimiento = new Date(nacimiento);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    const dia = hoy.getDate() - nacimiento.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
    }

    if (edad < 18) {
        alert("Debes ser mayor de 18 para registrarse");
        return;
    } else {
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

}