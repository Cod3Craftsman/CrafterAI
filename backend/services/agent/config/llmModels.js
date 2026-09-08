import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.4,
  maxTokens: 768,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
});

export const getModel = (agent) => {
  switch (agent) {
    case "chat":
      return groq;

    case "search":
      return groq;

    case "coding":
      return gemini;

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
