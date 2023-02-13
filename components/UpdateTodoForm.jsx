import { deleteTodo, updateTodo } from "@/lib/to-dos/todosUtils";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export const UpdateTodoForm = ({ todo, setVisible }) => {

    const [users, setUsers] = useState([{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }]);
    const queryClient = useQueryClient();
    // const todos = queryClient.getQueryData('todos');

    const mutation = useMutation({
        mutationFn: values => {
            return updateTodo(todo.id, values);
        },
        onSuccess: () => {
            setVisible(false);
            queryClient.invalidateQueries(['todos']);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: values => {
            return deleteTodo(todo.id);
        },
        onSuccess: () => {
            setVisible(false);
            queryClient.invalidateQueries(['todos']);
        }
    });

    if (deleteMutation.isLoading || mutation.isLoading) {
        return (
            <div className="flex flex-row justify-center">
                <svg width="25" height="25" className="animate-spin">
                    <circle cx="12.5" cy="12.5" r="10" fill="none" stroke="#3D4451" stroke-width="5" stroke-dasharray="126" stroke-dashoffset="0" className="spinner">
                        <animate attributeName="stroke-dashoffset" values="0;126;0" dur="1s" repeatCount="indefinite" />
                    </circle>
                </svg>
            </div>
        )
    }

    return (
        <>
            <h2 className="card-title">Tarea</h2>
            <Formik
                initialValues={{
                    title: todo.title || '',
                    productionId: todo.productionId || '',
                    type: todo.type || '',
                    deadline: todo.deadline || '',
                    content: todo.content || '',
                    priority: todo.priority || '',
                    status: todo.status || '',
                    owners: todo.owners || '',
                    attachments: todo.attachments || '',
                }}
                onSubmit={mutation.mutate}
                enableReinitialize
            >
                <Form>
                    <div className="flex flex-col items-center gap-2">
                        <div className="form-control w-full max-w-md">
                            <label className="label" htmlFor="title">
                                <span className="label-text">Título</span>
                            </label>
                            <Field component="input" name="title" type="text" placeholder="Título" className="input input-bordered" />
                        </div>
                        <div className="form-control w-full max-w-md">
                            <label className="label" htmlFor="content">
                                <span className="label-text">Contenido</span>
                            </label>
                            <Field component="textarea" name="content" type="text" className="textarea textarea-bordered" placeholder="Escriba aquí"></Field>
                        </div>
                        <div className="flex justify-between w-full max-w-md">

                            <div className="form-control max-w-sm">
                                <label className="label" htmlFor="deadline">
                                    <span className="label-text">Fecha de Termino</span>
                                </label>
                                <Field component="input" type="datetime-local" name="deadline" />
                            </div>
                        </div>

                        <div className="form-control w-full max-w-md">
                            <label className="label" htmlFor="owners">
                                <span className="label-text">Owners</span>
                            </label>
                            <div className="w-full gap-2 flex flex-row justify-between flex-wrap">
                                {
                                    users.map((user, idx) => (
                                        <label key={idx} className="label cursor-pointer">
                                            <span className="label-text mr-2">{user.name}</span>
                                            <Field component="input" type="checkbox" name="owners" value={user.name} className="checkbox  checkbox-xs" />
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="flex flex-row justify-around w-full gap-2">
                            <div className="form-control w-full max-w-md">
                                <label className="label" htmlFor="type">
                                    <span className="label-text">Tipo</span>
                                </label>
                                <Field as="select" name="type" className="select select-bordered">
                                    <option defaultValue disabled value="">Selecciona un tipo</option>
                                    <option value="Finanzas">Finanzas</option>
                                    <option value="Diseño">Diseño</option>
                                </Field>
                                <ErrorMessage name="type">
                                    {msg => <p className="text-red-400">{msg}</p>}
                                </ErrorMessage>
                            </div>
                            <div className="form-control w-full max-w-md">
                                <label className="label" htmlFor="priority">
                                    <span className="label-text">Prioridad</span>
                                </label>
                                <Field as="select" name="priority" className="select select-bordered">
                                    <option defaultValue disabled value="">Elige una prioridad</option>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                </Field>
                            </div>
                        </div>

                        {/* <div className="form-control w-full max-w-md">
                            <label className="label" htmlFor="subTask">
                                <span className="label-text">Añadir a tarea</span>
                            </label>
                            <Field as="select" name="parent" className="select select-bordered">
                                <option defaultValue disabled value="">Añadir a tarea:</option>
                                {
                                    todos.map((queryTodo) => (
                                        queryTodo.id !== todo.id && !queryTodo.isSubtask &&
                                        <option key={queryTodo.id} value={`/todos/${queryTodo.id}`}>{queryTodo.title} - {queryTodo.content.slice(0, 15)}...</option>
                                    ))
                                }
                            </Field>
                            <ErrorMessage name="parent" >
                                {msg => <p className="text-red-400">{msg}</p>}
                            </ErrorMessage>
                        </div> */}


                        <div className="flex justify-between gap-2 w-full max-w-md">
                            <div className="form-control w-full">
                                <button type="submit" className="btn btn-">Actualizar</button>
                            </div>
                            <div className="form-control w-full">
                                <button onClick={deleteMutation.mutate} type="button" className="btn btn-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    )
}
