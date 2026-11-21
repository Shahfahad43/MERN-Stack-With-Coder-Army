import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

export const newMessage = async (req, res) => {
  try {
    const newMessage = await new Message(req.body);
    newMessage.save();

    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      message: req.body.text,
    });

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("newMessage Backend Error:", error);
    return res.status(500).json(error.message);
  }
};
