function validarCorreo(correo) {
    const regex = /^[^@\s]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formLogin");
    const correoInput = document.getElementById("correo");
    const mensaje = document.getElementById("clave");

    // 🔹 Validación en el submit
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        mensaje.innerText = ""; // limpiar mensajes previos

        const correo = correoInput.value.trim();

        if (!validarCorreo(correo)) {
            correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
            correoInput.reportValidity();
            mensaje.style.color = "red";
            mensaje.innerText = "❌ Correo inválido. Solo se permiten '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'.";
            return;
        }

        // ✅ Si es válido
        correoInput.setCustomValidity("");
        mensaje.style.color = "green";
        mensaje.innerText = "✅ Correo válido. Redirigiendo...";

        // Opcional: esperar 1 segundo antes de redirigir
        setTimeout(() => {
            window.location.href = "../../index.html"; // 🔥 aquí redirige
        }, 1000);
    });

    // 🔹 Limpiar error cuando el usuario escriba de nuevo
    correoInput.addEventListener("input", () => {
        correoInput.setCustomValidity("");
        mensaje.innerText = "";
    });
});

