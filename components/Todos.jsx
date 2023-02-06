import { TodoForm } from "@/components/TodoForm";
import { TodosList } from "@/components/TodosList";
import { getTodos } from "@/lib/to-dos/todosUtils";
import { useState } from "react";
import { Button, Modal } from "react-daisyui";
import { useQuery } from "react-query";


export const Todos = () => {

    const [visible, setVisible] = useState(false);

    const { data: todos, status, isSuccess, isLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodos
    });

    if(isLoading) return (<button className="loading btn">Cargando...</button>)

    if (isSuccess) return (
        <>
            <Button onClick={() => setVisible(true)} className="btn btn-md btn-success"> Agregar Tarea</Button>
            {
                !!visible &&
                <Modal open={visible} onClickBackdrop={() => setVisible(false)}>
                    <Modal.Body>
                        <TodoForm todos={todos}/>
                    </Modal.Body>
                </Modal>
            }

            <TodosList todos={todos} />
        </>
    )
}
