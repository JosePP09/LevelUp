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
    const [msg, setMsg] = useState("");
    const history = useHistory();

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        const { run, nombre, correo, clave, fecha} = form;
        if (!validarRun(run)) return setMsg("RUN es incorrecto");
        if (!nombre) return setMsg("Nombre en blanco");
        if (!validarCorreo(correo)) return setMsg("Correo incorrecto");
        if (!clave) return setMsg("Clave en blanco");
        if (!esMayorEdad(fecha)) return setMsg("Debe ser mayor de 18 años");

        await addUser(form);
        setMsg("Formularío de envió correctamente");
        setTimeout(() => {
            history.push(correo === "admin@duoc.cl" ? "/perfil-admin?nombre="+nombre : "/perfil-cliente?nombre="+nombre);

        }, 1000);
            
    };

    return (
        <div>
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
