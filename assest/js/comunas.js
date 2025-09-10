const regiones = {
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Quillota"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"],
    "Antofagasta": ["Antofagasta", "Calama", "Mejillones", "Tocopilla"]
};

const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");

if (!regionSelect || !comunaSelect) {
    console.warn('No se encontraron los elementos region o comuna');
}

// Llenar el select de regiones
for (let region in regiones) {
    let option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
}

// Cambiar comunas al seleccionar región
if (regionSelect && comunaSelect) {
    regionSelect.addEventListener("change", () => {
        comunaSelect.innerHTML = "<option value=''>Seleccione una comuna</option>"; // limpiar comunas
    
    const comunas = regiones[regionSelect.value];
    if (comunas) {
        comunas.forEach(c => {
            let option = document.createElement("option");
            option.value = c;
            option.textContent = c;
            comunaSelect.appendChild(option);
        });
    }
    });
}