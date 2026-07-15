import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: Sting,
      default: "New Chat",
    },
    userId : {
      type : String ,
    }
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
