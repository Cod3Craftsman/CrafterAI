import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";



const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.4,
  maxTokens: 768,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
});


const openRouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 4000,
});

export const getModel = (agent) => {
  switch (agent) {
    case "chat":
      return groq;

    case "search":
      return groq;

    case "coding":
      return openRouter;

    case "pdf":
      return gemini;

    case "ppt":
      return gemini;

    case "vision":
      return gemini;
    default:
      return groq;
  }
};
