import { genrateresponse, generateChatTitle } from "../services/chat.services.js";
import { chatModel } from "../models/chat.model.js";
import { messageModel } from "../models/message.model.js";


export const createChat = async (req, res) => {
    try {
        const { message, chatId } = req.body;


        let chat, title;
        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title,
            })

        }
        await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user",
        })

        const messages = await messageModel.find({ chat: chatId || chat._id });
        const response = await genrateresponse(messages);
        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: response,
            role: "ai",

        })

        res.json({
            success: true,
            title,
            chat,
            aiMessage,
            message: "Chat created successfully",
        });

    } catch (error) {
        console.log(error);
    }
}

export const getChats = async (req, res) => {
    try {
        const user = req.user.id
        const chats = await chatModel.find({
            user,
        }).sort({ createdAt: 1 });

        return res.json({
            success: true,
            chats,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            })
        }
        const messages = await messageModel.find({
            chat: chatId
        })
        return res.json({
            success: true,
            messages,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            })
        }
        await messageModel.deleteMany({
            chat: chatId,
        })
        return res.json({
            success: true,
            message: "Chat deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}