// import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import { internet } from "./internet.services.js";
import z from "zod";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
});

// const mistralModel = new ChatMistralAI({
//     model: "mistral-small-latest",
//     apiKey: process.env.MISTRAL_API_KEY,
// });

export const genrateresponse = async (messages) => {
  const now = new Date();

  //   const currentDate = now.toLocaleDateString("en-IN", {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //   });

  //   const currentTime = now.toLocaleTimeString("en-IN", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //   });

  const response = await Agent.invoke({
    messages: [
      //       new SystemMessage(`You are Perplexity AI.
      // Current date: ${currentDate}, Current time: ${currentTime}.

      // IMPORTANT:
      // - Answer date/time questions from the provided values
      // - internetSearchTool call only once or twice
      // -
      // - If the question doesn't need live data, answer from knowledge`),
      ...messages
        .map((msg) => {
          if (msg.role === "user") {
            return new HumanMessage(msg.content);
          }

          if (msg.role === "ai") {
            return new AIMessage(msg.content);
          }

          return null;
        })
        .filter(Boolean),
    ],
  });

  return response.messages.at(-1).content;
};

const internetSearchTool = tool(internet, {
  name: "internetSearchTool",
  description:
    "Search the internet for current/live information only. NOT for dates, times, or general knowledge",
  schema: z.object({
    query: z.string().describe("Enter query"),
  }),
});

const Agent = createAgent({
  model: model,
  tools: [internetSearchTool],
  config: {
    recursionLimit: 10, // Stop after 10 tool calls
  },
});

export const generateChatTitle = async (message) => {
  const response = await Agent.invoke({
    messages: [
      new SystemMessage(`
You are a helpful assistant named Perplexity.

Generate a short understandable title.

Rules:
- only 2 to 4 words
- clear and meaningful
- based on the user's first message
- no quotes
`),

      new HumanMessage(`Generate title for this message: ${message}`),
    ],
  });

  return response.messages.at(-1).content;
};
