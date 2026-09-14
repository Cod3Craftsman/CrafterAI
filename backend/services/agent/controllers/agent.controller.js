import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
    });
    const response = result.aiResponse;
    const images = result?.images || [];
    const artifacts = result?.artifacts

    // short term memory-redis
    await addMessage(conversationId, "user", prompt);
    await addMessage(conversationId, "assistant", response);

    const serverUrl = process.env.CHAT_SERVICE;
    await axios.post(`${serverUrl}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    await axios.post(`${serverUrl}/save-message`, {
      conversationId,
      role: "assistant",
      content: response,
      images: images,
      artifacts: artifacts,
    });

    return res.status(200).json({
      answer: response,
      images: images,
      artifacts: result?.artifacts || [],
    });
  } catch (error) {
    return res.status(500).json({ message: `agent error ${error}` });
  }
};
