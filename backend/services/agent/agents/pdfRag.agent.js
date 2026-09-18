import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectordb.js";
import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const pdfRag = async (state) => {
  try {
    const buffer = fs.readFileSync(state?.file?.path);
    const pdf = new PDFParse({
      data: buffer,
    });

    const result = await pdf.getText();
    const text = result?.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;
    const store = await vectorStore(docs, collectionName);
    const relevantDocs = await store.similaritySearch(state?.prompt, 5);

    const context = relevantDocs.map((d) => d?.pageContent).join("\n\n");

    const llm = getModel("pdf-rag");

    const messages = [
      new SystemMessage(`You are CrafterAI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:
"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),

      new HumanMessage(`
Context:
${context}

Question:
${state?.prompt}
`),
    ];

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: response?.content,
    };
  } catch (error) {
    console.error("PDF RAG ERROR:", error);
    return {
      ...state,
      aiResponse: "Failed to Analyze pdf",
    };
  } finally {
    if (state?.file?.path) {
      try {
        await fs.unlink(state.file.path);
      } catch (error) {
        console.error("Failed to delete temporary PDF:", error.message);
      }
    }
  }
};
