import { socketOnConnect } from "../services/chat.socket";
import { getChats, getMessages, deleteChat as deleteChatApi, sendMessage } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, deleteChat as deleteChatAction } from "../services/chat.slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";




function UseChat() {

    useEffect(() => {
        socketOnConnect();
    }, [])

    const dispatch = useDispatch();

    async function handleCreateNewChat({ message, chatId }) {
        try {
            dispatch(setLoading(true));
            const data = await sendMessage({ message, chatId });

            const { chat, aiMessage } = data;
            console.log(chat, aiMessage);

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            }

            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user",
                animate: false,
            }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
                animate: true,
            }))
            dispatch(setCurrentChatId(chatId || chat._id))
            dispatch(setLoading(false))

        }
        catch (error) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            console.log(error)
        }
    }


    async function handleGetChats() {
        try {
            dispatch(setLoading(true));
            const data = await getChats();
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})));
            dispatch(setLoading(false));
        }
        catch (error) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            console.log(error)
        }
    }

    async function handlegetMessages(chats, chatId) {
        try {
            dispatch(setLoading(true));

            // open selected chat
            dispatch(setCurrentChatId(chatId));

            // fetch only if messages not already loaded
            if (!chats[chatId]?.messages?.length) {
                const data = await getMessages(chatId);

                const { messages } = data;

                const formattedMessages = messages.map((msg) => ({
                    content: msg.content,
                    role: msg.role,
                    animate: false,
                }));

                dispatch(
                    addMessages({
                        chatId,
                        messages: formattedMessages,
                    })
                );
            }
        } catch (error) {
            dispatch(setError(error.message));
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(setLoading(true));
            const data = await deleteChatApi(chatId);
            if (data.success) {
                dispatch(deleteChatAction({ chatId }));
            }
            dispatch(setLoading(false));

        }
        catch (error) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            console.log(error);
        }
    }


    return { handleCreateNewChat, handleGetChats, handlegetMessages, handleDeleteChat };


}
export default UseChat;
