import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId: ", userId);
    const conversation = await Conversation.create({
      userId: userId,
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(`Create conversation error ${error}`);
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId: ", userId);
    const conversations = await Conversation.find({
      userId: userId,
    }).sort({ createdAt: -1 });
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: `getConversations error ${error}` });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    const message = await Message.create({
      conversationId,
      role,
      content,
    })
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: `saveMessage error ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const messages = await Message.find({
      conversationId,
    }).sort({createdAt : 1})
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: `getMessage error ${error}` });
  }
};
