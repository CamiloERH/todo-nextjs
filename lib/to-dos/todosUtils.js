import axios from "axios";
import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from 'uuid';

const api = axios.create();

export const addAttachmentToTodo = async (todoId, files, currentAttachments = []) => {
    try {
        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push(uploadFile(file));
        }
        const photoUrls = await Promise.all(fileUploadPromises);
        await updateTodo(todoId, { attachments: [...currentAttachments, ...photoUrls] });
    } catch (error) {
        console.log(error);
    }
}

export const deleteAttachmentOfTodo = async (todoId, file, currentAttachments = []) => {
    try {
        currentAttachments = currentAttachments.filter((attachment) => attachment !== file);
        console.log(file);
        await deleteFile(file);
        await updateTodo(todoId, { attachments: currentAttachments});
    } catch (error) {
        console.log(error);
    }
}

export const addTodo = (todo) => {
    return api.post(`api/todos`, todo);
}

export const getTodos = async () => {
    const res = await api.get(`api/todos`);
    return res.data.todos;
}

export const updateTodo = async (id, todo) => {
    return await api.put(`api/todo/${id}`, todo);
}

export const addSubtask = (parentId, todo) => {
    return api.post(`api/todo/${parentId}`, todo);
}

export const deleteTodo = (todoId) => {
    return api.delete(`api/todo/${todoId}`);
}

async function uploadFile(file) {
    if (!file) { throw new Error('No hay archivo para subir'); }
    const name = v4();
    const storageRef = ref(storage, name);
    try {
        await uploadBytes(storageRef, file).then(snapshot => {
            console.log(snapshot);
        });
        return getDownloadURL(storageRef);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

async function deleteFile(file) {
    const imageRef = ref(storage, file);
    await deleteObject(imageRef);
}