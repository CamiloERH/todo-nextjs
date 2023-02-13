import { addTodo } from "@/lib/to-dos/todosUtils";
import { basicSchema } from "@/schemas";
import { format, utcToZonedTime } from "date-fns-tz";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export const TodoForm = ({ setVisible }) => {

  const [users, setUsers] = useState([{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }]);
  const queryClient = useQueryClient();
  const todos = queryClient.getQueryData('todos');


  // const [time, setTime] = useState(null);

  // useEffect(() => {
  //   const timezone = 'America/Santiago';
  //   const date = utcToZonedTime(new Date(), timezone);
  //   const formattedDate = format(date, "dd-MM-yyyy HH:mm", { timeZone: timezone });
  //   setTime(formattedDate);
  //   console.log(time)
  //   return () => {
  //     setTime(null);
  //   }
  // }, []);

  const mutation = useMutation({
    mutationFn: values => {
      return addTodo(values);
    },
    onSuccess: () => {
      setVisible(false);
      queryClient.invalidateQueries(['todos']);
    }
  });


  if (mutation.isLoading) {
    return (
      <div className="flex flex-row justify-center">
        <svg width="25" height="25" className="animate-spin">
          <circle cx="12.5" cy="12.5" r="10" fill="none" stroke="#3D4451" stroke-width="5" stroke-dasharray="126" strokeDashoffset="0" className="spinner">
            <animate attributeName="stroke-dashoffset" values="0;126;0" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    )
  }

  return (
    <>
      <h2 className="card-title">Nueva tarea</h2>
      <Formik
        initialValues={{
          title: '',
          productionId: '',
          type: '',
          deadline: '',
          content: '',
          priority: '',
          status: '',
          owners: [],
          attachments: []
        }}
        onSubmit={mutation.mutate}
        validationSchema={basicSchema}
      >
        {({ errors, touched, setFieldValue }) => {
          return (
            <Form>
              <div className="flex flex-col items-center gap-2">
                <div className="form-control w-full max-w-md">
                  <label className="label" htmlFor="title">
                    <span className="label-text">Título</span>
                  </label>
                  <Field component="input" name="title" type="text" placeholder="Título" className={`input input-bordered ${errors.title && touched.title ? 'input-error' : null}`} />
                  <ErrorMessage name="title" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label" htmlFor="content">
                    <span className="label-text">Contenido</span>
                  </label>
                  <Field component="textarea" name="content" type="textarea" className={`textarea textarea-bordered ${errors.content && touched.content ? 'textarea-error' : null}`} placeholder="Escriba aquí" />
                  <ErrorMessage name="content" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
                </div>


                <div className="form-control max-w-sm">
                  <label className="label" htmlFor="deadline">
                    <span className="label-text">Fecha de Termino</span>
                  </label>
                  <Field component="input" type="datetime-local" name="deadline" />
                  <ErrorMessage name="deadline" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
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
                  <ErrorMessage name="owners" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
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
                    <ErrorMessage name="type" >
                      {msg => <p className="text-red-400">{msg}</p>}
                    </ErrorMessage>
                  </div>
                  <div className="form-control w-full max-w-md">
                    <label className="label" htmlFor="priority">
                      <span className="label-text">Prioridad</span>
                    </label>
                    <Field as="select" name="priority" className="select select-bordered">
                      <option defaultValue disabled value="">Elige una prioridad</option>
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </Field>
                    <ErrorMessage name="priority" >
                      {msg => <p className="text-red-400">{msg}</p>}
                    </ErrorMessage>
                  </div>
                </div>
                <button className='btn w-full max-w-md' type='submit'>Enviar</button>
              </div>
            </Form>
          )
        }
        }

      </Formik>
    </>
  )
}
