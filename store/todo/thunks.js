
import { addNewNote } from './todoSlice';

export const saveNewNote = (note) => {
    return async (dispatch) => {
        const newNote = {
            ...note,
            createdAt: new Date().toISOString(),
        }
        dispatch(addNewNote(newNote));
    }
}
