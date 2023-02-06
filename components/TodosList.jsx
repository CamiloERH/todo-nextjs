import { getTodos } from "@/lib/to-dos/todosUtils";
import { useState } from "react";
import { Button, Modal, Table } from "react-daisyui";
import { useQuery } from "react-query";
import { UpdateTodoForm } from "./UpdateTodoForm";


export const TodosList = ({ todos }) => {



    const [visible, setVisible] = useState(false);
    const [modalContent, setModalContent] = useState();

    const handleModalContent = (todo) => {
        setModalContent(todo);
        setVisible(!visible);
    }

    return (
        <>
            <Table>
                <Table.Head>
                    <span>Type</span>
                    <span>Owners</span>
                    <span>Title</span>
                    <span>Content</span>
                    <span>createdAt</span>
                    <span>Deadline</span>
                    <span>Priority</span>
                    <span>Status</span>
                    <span>Acción</span>
                </Table.Head>
                <Table.Body>
                    {
                        todos.map((todo, idx) => (
                            <Table.Row className="hover" key={todo.id}>
                                <span>{todo.type}</span>
                                <span>{JSON.stringify(todo.owners)}</span>
                                <span>{todo.title}</span>
                                <span>{todo.content}</span>
                                <span>{JSON.stringify(todo.createdAt)}</span>
                                <span>{JSON.stringify(todo.deadline)}</span>
                                <span>{todo.priority}</span>
                                <span>{todo.status}</span>
                                <button className="btn btn-sm btn-info" onClick={() => handleModalContent(todo)}>Ver Tarea</button>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            {
                !!modalContent &&
                <Modal open={visible} onClickBackdrop={() => setVisible(false)}>
                    <Modal.Body>
                        <UpdateTodoForm todo={modalContent} setVisible={setVisible} />
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}
