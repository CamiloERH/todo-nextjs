import { TodoForm } from "@/components/TodoForm";
import { TodosList } from "@/components/TodosList";
import { getTodos } from "@/lib/to-dos/todosUtils";
import { useState } from "react";
import { useQuery } from "react-query";


export const Todos = () => {

    const [visible, setVisible] = useState(false);

    const { data: todos, status, isSuccess, isLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos
    });

    console.log(todos);

    if (isLoading) return (<button className="loading btn">Cargando...</button>)

    if (isSuccess) return (
        <>
            <button onClick={() => setVisible(true)} className="btn btn-md btn-success"> Agregar Tarea</button>
            {
                !!visible &&
                <div className={`modal ${visible ? 'modal-open' : null}`}>
                    <div className="modal-box">
                        <label onClick={() => setVisible(false)} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <TodoForm setVisible={setVisible} />
                    </div>
                </div>
            }

            <TodosList todos={todos} />
        </>
    )
}
