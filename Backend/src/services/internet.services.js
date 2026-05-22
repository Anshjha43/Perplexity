import { tavily } from "@tavily/core";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY,
});

export const internet = async ({ query }) => {
    console.log("TOOL CALLED:", query);
    const response = await tvly.search({
        query,
        max_results: 5,
    });
    console.log(response.results);
    return response.results
        .map((item) => `${item.title}\n${item.content}\n${item.url}`)
        .join("\n\n");
};