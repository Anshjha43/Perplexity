import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/services/auth.slice";
import chatReducer from "./features/chat/services/chat.slice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    }
})
export default store;