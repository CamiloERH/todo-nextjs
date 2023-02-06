import * as yup from "yup";

export const basicSchema = yup.object().shape({
    title: yup.string().required('Ingresa un título'),
    content: yup.string().required('Contenido es requerido'),
    createdAt: yup.string().required('Fecha es requerida'),
    deadline: yup.string().required('Fecha es requerida'),
    owners: yup.array().min(1, 'Debe seleccionar al menos un Owner'),
    priority: yup.string().required('Es requerida una prioridad')
});