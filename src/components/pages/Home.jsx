import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <main>
            {/* Enlace que usa React Router pero carga el formulario estático */}
            <Link to="/registro">Ir al registro</Link>
        </main>
    )
};
export default Home;