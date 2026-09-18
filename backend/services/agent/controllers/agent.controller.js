import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const file = req.file;

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      file,
    });
    const response = result?.aiResponse;
    const responseText =
      typeof response === "string"
        ? response
        : response
            ?.filter((item) => item.type === "text")
            ?.map((item) => item.text)
            ?.join("\n") || "";

    const images = result?.images || [];
    const artifacts = result?.artifacts;

    // short term memory-redis
    await addMessage(conversationId, "user", prompt);
    await addMessage(conversationId, "assistant", responseText);

    const serverUrl = process.env.CHAT_SERVICE;
    await axios.post(`${serverUrl}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    await axios.post(`${serverUrl}/save-message`, {
      conversationId,
      role: "assistant",
      content: responseText,
      images: images,
      artifacts: artifacts,
    });

    return res.status(200).json({
      answer: responseText,
      images: images,
      artifacts: result?.artifacts || [],
    });
  } catch (error) {
    console.error("STACK:", error?.stack);
    return res.status(500).json({ message: `agent error ${error}` });
  }
};
