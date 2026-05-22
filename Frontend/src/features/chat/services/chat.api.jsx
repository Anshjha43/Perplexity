import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/chat",
    withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
    try {
        const response = await api.post("/ask-ai", { message, chat: chatId });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getChats = async () => {
    try {
        const response = await api.get("/get-chats");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMessages = async (chatId) => {
    try {
        const response = await api.get(`/get-messages/${chatId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteChat = async (chatId) => {
    try {
        const response = await api.delete(`/delete-chat/${chatId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}