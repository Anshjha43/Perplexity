import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title: title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, animate = false } = action.payload;
            state.chats[chatId].messages.push({ content, role, animate })
        },

        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId].messages.push(...messages);
        },
        markMessageAnimated: (state, action) => {
            const { chatId, messageIndex } = action.payload;
            const message = state.chats[chatId]?.messages?.[messageIndex];

            if (message) {
                message.animate = false;
            }
        },
        deleteChat: (state, action) => {
            const { chatId } = action.payload;
            delete state.chats[chatId];
        },

    }
});



export const { setError, setLoading, setChats, createNewChat, setCurrentChatId, addNewMessage, addMessages, markMessageAnimated, deleteChat } = chatSlice.actions;

export default chatSlice.reducer;
