document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    const correoInput = document.getElementById("correoLogin");
    const claveInput = document.getElementById("claveLogin");
    const mensaje = document.getElementById("mensajeLogin");

    if (!form) return console.error("No se encontró #formLogin");

    // Inicializar Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
        authDomain: "tiendalevelup-f5867.firebaseapp.com",
        projectId: "tiendalevelup-f5867",
        storageBucket: "tiendalevelup-f5867.appspot.com",
        messagingSenderId: "49561303717",
        appId: "1:49561303717:web:711b2ab36f8100a134eb4c",
        measurementId: "G-V7732K0H9Z"
    };

    if (!firebase.apps?.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth(); //Apunta a Authentication Firebase
    const db = firebase.firestore(); //Apunta a la colección usuario del base de datos en Firebase

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensaje.innerText = "";

        const correo = correoInput.value.trim().toLowerCase();
        const clave = claveInput.value;

        if (!correo || !clave) {
            mensaje.style.color = "red";
            mensaje.innerText = "Debes completar correo y clave";
            return;
        }

        // Admin: autenticar con Firebase Auth
        if (correo === "admin@levelup.cl") {
            try {
                await auth.signInWithEmailAndPassword(correo, clave);
                // Guardar usuario en localStorage
                const usuario = { nombre: "Administrador", correo, rol: "admin" };
                localStorage.setItem("usuario", JSON.stringify(usuario));

                mensaje.style.color = "green";
                mensaje.innerText = "Bienvenido Administrador, redirigiendo...";
                setTimeout(() => {
                    window.location.href = "../page/perfilAdmin.html";
                }, 1000);
            } catch (error) {
                console.error("Error login admin:", error);
                mensaje.style.color = "red";
                mensaje.innerText = "Credenciales incorrectas para administrador";
            }
            return;
        }

        // Cliente: validar desde Firestore
        try {
            // Cambiado: Usar la colección 'usuario*'
            const query = await db.collection("usuario") // Ajustado a 'usuario*'
                .where("correo", "==", correo)
                .where("clave", "==", clave)
                .get();

            if (!query.empty) {
                const doc = query.docs[0];
                const userData = doc.data();
                const nombre = userData.nombre || correo;
                const run = userData.run; // Asumiendo que el campo se llama 'run' en Firestore

                // Validar que el run exista
                if (!run) {
                    console.error("El usuario en Firestore no tiene el campo 'run'.");
                    mensaje.style.color = "red";
                    mensaje.innerText = "Error: Datos de usuario incompletos.";
                    return;
                }

                // Guardar usuario en localStorage con rol real y run
                // Cambiado: Agregar el 'run' y el 'id' del documento a los datos del usuario
                const usuario = {
                    id: doc.id, // Incluir el ID del documento de Firestore
                    nombre,
                    correo,
                    run, // <-- Agregar el run
                    rol: "cliente"
                };
                localStorage.setItem("usuario", JSON.stringify(usuario));

                mensaje.style.color = "green";
                mensaje.innerText = "Bienvenido Cliente, redirigiendo...";
                setTimeout(() => {
                    // Cambiado: Ajustar la ruta si es necesario
                    window.location.href = `../page/perfilCliente.html`;
                }, 1000);
            } else {
                mensaje.style.color = "red";
                mensaje.innerText = "Correo o clave incorrectos";
            }
        } catch (error) {
            console.error("Error login cliente:", error);
            mensaje.style.color = "red";
            mensaje.innerText = "Error al verificar usuario";
        }
    });
});