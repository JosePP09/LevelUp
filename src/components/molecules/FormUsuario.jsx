import React, {useState} from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { validarCorreo, validarRun, esMayorEdad } from "../../utils/formulario1";
import {addUser} from "../../services/firestoreService";
import {useHistory} from "react-router-dom";

const FormUsuario = () => {
    const [form, setForm] = useState({
        run: "",
        nombre: "",
        apellido: "",
        correo: "",
        fecha: "",
        codigoReferido: "",
        clave: "",
        confirmarClave: "",
        region: "",
        comuna: "",
        direccion: ""
    });
    const [msg, setMsg] = useState();
    const history = useHistory();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {run, nombre, apellido, correo, fecha, codigoReferido, clave, confirmarClave, region, comuna, direccion} = form;
        
        // Limpiar mensajes
        setMsg("");

        // Validación Run (mejorada)
        const runLimpio = run.trim().toUpperCase();
        if(!validarRun(runLimpio)) {
            return setMsg("El RUN es incorrecto. Debe tener 8 dígitos + número o K verificador");
        }

        // Validación Nombre
        const nombreLimpio = nombre.trim();
        if (nombreLimpio === "") {
            return setMsg("El nombre es obligatorio");
        }

        // Validación correo
        const correoLimpio = correo.trim();
        if (!validarCorreo(correoLimpio)) {
            return setMsg("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
        }

        // Validación de Edad
        if (!esMayorEdad(fecha)) {
            return setMsg("Debe ser mayor a 18 años para registrarse");
        }

        // Validación contraseña
        if(!clave) 
            return setMsg("Clave es obligatoria");

        try {
            // Actualizar el form con los valores limpios
            const formLimpio = {
                ...form,
                run: runLimpio,
                nombre: nombreLimpio,
                correo: correoLimpio
            };

            await addUser(formLimpio);
            setMsg("Formulario enviado correctamente");
            
            // Redirección mejorada
            setTimeout(() => {
                const destino = correoLimpio.toLowerCase() === "admin@duoc.cl" 
                    ? `/perfil-admin?nombre=${encodeURIComponent(nombreLimpio)}`
                    : `/perfil-cliente?nombre=${encodeURIComponent(nombreLimpio)}`;
                history.push(destino);
            }, 1000);
        } catch (error) {
            setMsg("Error al enviar formulario");
        }
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <Input id="run" label="RUN" value={form.run} onChange={handleChange} required />
                <Input id="nombre" label="Nombre" value={form.nombre} onChange={handleChange} required />
                <Input id="apellido" label="Apellido" value={form.apellido} onChange={handleChange} required />
                <Input id="correo" label="Correo" value={form.correo} onChange={handleChange} required />
                <Input id="fecha" type="date" label="Fecha de Nacimiento" value={form.fecha} onChange={handleChange} required />
                <Input id="codigoReferido" label="Codigo Referido" value={form.codigoReferido} onChange={handleChange} />
                <Input id="clave" type="password" label="Clave" value={form.clave} onChange={handleChange} required />
                <Input id="confirmarClave" type="password" label="Confirmar Clave" value={form.confirmarClave} onChange={handleChange} required />
                <Input id="region" label="Región" value={form.region} onChange={handleChange} required />
                <Input id="comuna" label="Comuna" value={form.comuna} onChange={handleChange} required />
                <Input id="direccion" label="Dirección" value={form.direccion} onChange={handleChange} required />
                <Button type="submit">Enviar</Button>
                <p style={{color: "crimson"}}>{msg}</p>
            </form>
        </div>
    );
};

export default FormUsuario;
