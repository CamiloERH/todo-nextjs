import { createSlice } from '@reduxjs/toolkit';

export const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        notes: []
    },
    reducers: {
        addNewNote: (state, action) => {
            state.notes.push(action.payload);
        }
    }
});

export const {
    addNewNote
} = todoSlice.actions;