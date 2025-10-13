// Validaciones para formulario de contacto
export const validarFormularioContacto = (datos) => {
    const errores = {};
    
    // Validar nombre
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        errores.nombre = "El nombre debe tener al menos 2 caracteres";
    }
    
    // Validar correo
    const regexCorreo = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!datos.correo || !regexCorreo.test(datos.correo)) {
        errores.correo = "El correo debe ser válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)";
    }
    
    // Validar mensaje
    if (!datos.mensaje || datos.mensaje.trim().length < 10) {
        errores.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }
    
    return {
        esValido: Object.keys(errores).length === 0,
        errores
    };
};
