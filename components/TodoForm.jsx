import { addTodo } from "@/lib/to-dos/todosUtils";
import { basicSchema } from "@/schemas";
import { format, utcToZonedTime } from "date-fns-tz";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";



export const TodoForm = () => {

  const [users, setUsers] = useState([{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }]);
  const queryClient = useQueryClient();
  const todos = queryClient.getQueryData('todos');


  // const [time, setTime] = useState(null);

  // useEffect(() => {
  //   const timezone = 'America/Santiago';
  //   const date = utcToZonedTime(new Date(), timezone);
  //   const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm", { timeZone: timezone });
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
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['todos']);
    }
  });

  return (
    <>
      <h2 className="card-title">Nueva tarea</h2>
      <Formik
        initialValues={{
          title: '',
          productionId: '',
          type: '',
          createdAt: '',
          deadline: '',
          content: '',
          priority: '',
          status: '',
          owners: [],
          attachments: [],
          subTask: '',
        }}
        onSubmit={mutation.mutate}
        validationSchema={basicSchema}
      >
        {props => {
          return (
            <Form>
              <div className="flex flex-col items-center gap-2">
                <div className="form-control w-full max-w-md">
                  <label className="label" htmlFor="title">
                    <span className="label-text">Título</span>
                  </label>
                  <Field component="input" name="title" type="text" placeholder="Título" className={`input input-bordered ${props.errors.title ? 'input-error' : null}`} />
                  <ErrorMessage name="title" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label" htmlFor="content">
                    <span className="label-text">Contenido</span>
                  </label>
                  <Field component="textarea" name="content" type="text" className={`textarea textarea-bordered ${props.errors.content ? 'textarea-error' : null}`} placeholder="Escriba aquí" />
                  <ErrorMessage name="content" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
                </div>
                <div className="flex justify-between w-full max-w-md">
                  <div className="form-control max-w-sm">
                    <label className="label" htmlFor="createdAt">
                      <span className="label-text">Fecha de inicio</span>
                    </label>
                    <Field component="input" type="datetime-local" name="createdAt" />
                    <ErrorMessage name="createdAt" >
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
                  <ErrorMessage name="priority" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label" htmlFor="priority">
                    <span className="label-text">Subtarea</span>
                  </label>
                  <Field as="select" name="subTask" className="select select-bordered">
                    <option defaultValue disabled value="">Elige una subtarea</option>
                    {
                      todos.map((todo) => (
                        <option key={todo.id} value={`/todos/${todo.id}`}>{todo.title} - {todo.content.slice(0, 15)}...</option>
                      ))
                    }
                  </Field>
                  <ErrorMessage name="subTask" >
                    {msg => <p className="text-red-400">{msg}</p>}
                  </ErrorMessage>
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
