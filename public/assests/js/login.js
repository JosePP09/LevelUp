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

                // Buscar el documento de admin en Firestore
                const adminQuery = await db.collection("usuario")
                    .where("correo", "==", correo)
                    .limit(1)
                    .get();

                let userData = null;
                let run = null;
                let rol = "admin";

                if (!adminQuery.empty) {
                    // Usuario admin encontrado en Firestore
                    const doc = adminQuery.docs[0];
                    userData = doc.data();
                    run = userData.run;
                    rol = userData.rol || "admin";

                    // Guardar usuario en localStorage con el ID del documento
                    const usuario = {
                        id: doc.id, // Incluir el ID del documento de Firestore
                        nombre: userData.nombre || "Administrador",
                        correo,
                        run,
                        rol
                    };
                    localStorage.setItem("usuario", JSON.stringify(usuario));
                } else {
                    // Si no hay documento en Firestore, crearlo
                    const nuevoAdmin = {
                        run: "admin-run", // Valor por defecto para el admin
                        nombre: "Administrador",
                        correo,
                        clave, // Guardar la clave temporalmente, eventualmente podría ser encriptada
                        fecha: new Date().toISOString().split('T')[0],
                        telefono: "",
                        direccion: "",
                        rol: "admin",
                        activo: true,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    const docRef = await db.collection("usuario").add(nuevoAdmin);

                    // Guardar usuario en localStorage
                    const usuario = {
                        id: docRef.id, // ID del nuevo documento
                        nombre: nuevoAdmin.nombre,
                        correo,
                        run: nuevoAdmin.run,
                        rol: nuevoAdmin.rol
                    };
                    localStorage.setItem("usuario", JSON.stringify(usuario));
                }

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

        // Buscar usuario en Firestore para clientes y vendedores
        try {
            const query = await db.collection("usuario")
                .where("correo", "==", correo)
                .where("clave", "==", clave)
                .get();

            if (!query.empty) {
                const doc = query.docs[0];
                const userData = doc.data();
                const nombre = userData.nombre || correo;
                const run = userData.run; // Asumiendo que el campo se llama 'run' en Firestore
                const rol = userData.rol || "cliente"; // Obtener el rol del usuario en Firestore

                // Validar que el run exista
                if (!run) {
                    console.error("El usuario en Firestore no tiene el campo 'run'.");
                    mensaje.style.color = "red";
                    mensaje.innerText = "Error: Datos de usuario incompletos.";
                    return;
                }

                // Guardar usuario en localStorage con rol real y run
                const usuario = {
                    id: doc.id, // Incluir el ID del documento de Firestore
                    nombre,
                    correo,
                    run,
                    rol // <-- Usar el rol del documento Firestore
                };
                localStorage.setItem("usuario", JSON.stringify(usuario));

                mensaje.style.color = "green";

                // Redirigir según el rol del usuario (obtenido de Firestore)
                if (rol === "vendedor") {
                    mensaje.innerText = "Bienvenido Vendedor, redirigiendo...";
                    setTimeout(() => {
                        window.location.href = "../page/perfilVendedor.html";
                    }, 1000);
                } else {
                    // Por defecto, asumir que es cliente
                    mensaje.innerText = "Bienvenido Cliente, redirigiendo...";
                    setTimeout(() => {
                        window.location.href = "../page/perfilCliente.html";
                    }, 1000);
                }
            } else {
                mensaje.style.color = "red";
                mensaje.innerText = "Correo o clave incorrectos";
            }
        } catch (error) {
            console.error("Error login usuario:", error);
            mensaje.style.color = "red";
            mensaje.innerText = "Error al verificar usuario";
        }
    });
});