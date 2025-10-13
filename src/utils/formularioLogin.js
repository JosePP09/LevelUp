// Validaciones para formulario de login
export function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

export const validarLogin = (correo, clave) => {
    const errores = {};
    
    // Validar correo
    if (!correo || !validarCorreo(correo)) {
        errores.correo = "El correo debe ser válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)";
    }
    
    // Validar contraseña
    if (!clave || clave.length < 4) {
        errores.clave = "La contraseña debe tener al menos 4 caracteres";
    }
    
    // Validar credenciales de admin
    if (correo === "admin@duoc.cl" && clave !== "admin123") {
        errores.clave = "Contraseña incorrecta para administrador";
    }
    
    return {
        esValido: Object.keys(errores).length === 0,
        errores,
        esAdmin: correo === "admin@duoc.cl" && clave === "admin123"
    };
};
