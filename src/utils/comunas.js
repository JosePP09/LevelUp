// Datos de regiones y comunas de Chile
export const regiones = {
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes", "Providencia", "Ñuñoa"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Quillota", "San Antonio", "Los Andes"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel", "Chillán", "Tomé"],
    "Antofagasta": ["Antofagasta", "Calama", "Mejillones", "Tocopilla", "San Pedro de Atacama"],
    "La Araucanía": ["Temuco", "Villarrica", "Angol", "Pucón", "Lautaro"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Valdivia", "Castro", "Ancud"],
    "Tarapacá": ["Iquique", "Arica", "Pozo Almonte", "Huara"],
    "Atacama": ["Copiapó", "Vallenar", "Caldera", "Chañaral"]
};

export const obtenerComunasPorRegion = (region) => {
    return regiones[region] || [];
};

export const obtenerRegiones = () => {
    return Object.keys(regiones);
};
