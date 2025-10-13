import {userLocation} from "react-router-dom";

const PerfilCliente = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const nombre = queryParams.get("nombre");

    return (
    <div>
        <h2>Bienvenido , {nombre}</h2>
    </div>
    );
};

export default PerfilCliente;