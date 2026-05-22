import { aiService } from "../services/ai.services.js";

export const aiController = async (req, res) => {
    try {
        const { chatId, prompt } = req.body;

        if (!chatId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "chatId and prompt are required"
            });
        }

        const result = await aiService(prompt);

        return res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};