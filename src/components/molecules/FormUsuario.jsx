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
        if(!validarRun(run))
            return setMsg("Run inválido");

        if(!validarCorreo(correo))
            return setMsg("Correo inválido");

        if(!esMayorEdad(fecha))
            return setMsg("Debes ser mayor de 18 años");

        
            

    }
}