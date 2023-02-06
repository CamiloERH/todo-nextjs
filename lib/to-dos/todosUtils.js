import axios from "axios";

const api = axios.create();

export const addTodo = (todo) => {
    return api.post(`api/todos`, todo);
}

export const getTodos = async () => {
    const res = await api.get(`api/todos`);
    return res.data.todos;
}

export const updateTodo = (todo) => {
    // console.log(todo);
    return api.put(`api/todo/${todo.id}`, todo);  
}

export const deleteTodo = (todoId) => {
    return api.delete(`api/todo/${todoId}`);  
}

