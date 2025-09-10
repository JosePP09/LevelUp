//Validación del correo
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

function validarRun(run) {
    const regex = /^[0-9]{7,8}[0-9Kk]$/; 
    return regex.test(run);
}

//Validación de edad minima 18 años
function esMayorEdad(fecha) {
    const hoy = new Date();
    const fechaNacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes  = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad --;
    }
    return edad >= 18;
}

document.addEventListener("DOMContentLoaded", () => {
    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const fechaInput = document.getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    //limpiar los input y mensajes flotante automaticamente
    [runInput, nombreInput, correoInput, fechaInput].forEach(input => {
        input.addEventListener("input", () => {
            input.setCustomValidity("");
            mensaje.innerText = "";
        });
    });

});

