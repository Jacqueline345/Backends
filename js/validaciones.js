{
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById('registerForm').addEventListener("submit", function (event) {
            let nombre = document.getElementById("nombre").value.trim();
            let apellidos = document.getElementById("apellidos").value.trim();
            let telefono = document.getElementById("telefono").value.trim();
            let correo = document.getElementById("correos").value.trim();
            let nacimiento = document.getElementById("nacimiento").value.trim();
            let contraseña = document.getElementById("contraseña").value.trim();
            let rep_contra = document.getElementById("rep_contra").value.trim();
            let pin = document.getElementById("pin").value.trim();

            // Obtener los elementos donde se mostrarán los errores
            let correoError = document.getElementById("correoError");
            let fechaError = document.getElementById("fechaError");
            let passwordError = document.getElementById("passwordError");

            let isValid = true;

            // Validar que los campos no estén vacíos
            if (nombre === "" || apellidos === "" || telefono === "" || correo === "" || nacimiento === "" || contraseña === "" || rep_contra === "" || pin === "") {
                alert("Todos los campos son obligatorios.");
                isValid = false;
            }

            // Validar formato de email con regex
            let correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!correoRegex.test(correo)) {
                correoError.textContent = "Ingrese un email válido.";
                isValid = false;
            } else {
                correoError.textContent = "";
            }

            // Validar que la fecha no sea futura
            let fechaActual = new Date().toISOString().split("T")[0];
            if (nacimiento > fechaActual) {
                fechaError.textContent = "La fecha no puede ser futura.";
                isValid = false;
            } else {
                fechaError.textContent = "";
            }

            // Validar que las contraseñas sean iguales
            if (contraseña !== rep_contra) {
                passwordError.textContent = "Las contraseñas no coinciden.";
                isValid = false;
            } else {
                passwordError.textContent = "";
            }

            // Evita el envío si hay errores
            if (!isValid) {
                event.preventDefault();
            }
        });
    });
}
