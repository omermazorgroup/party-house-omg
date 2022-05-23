const express = require("express");
const router = express.Router();
const ChatModel = require("../models/ChatModel");
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");



router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.textsWith"
    );

    let chatsToBeSent = [];
    if (user.chats.length > 0) {
      chatsToBeSent = await user.chats.map((chat) => ({
        textsWith: chat.textsWith._id,
        name: chat.textsWith.name,
        profilePicUrl: chat.textsWith.profilePicUrl,
        lastText: chat.texts[chat.texts.length - 1].text,
        date: chat.texts[chat.texts.length - 1].date,

      }));
    }
    return res.json(chatsToBeSent);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});


router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId);

    if (user.unreadMessage) {
      user.unreadMessage = false;
      await user.save();
    }
    return res.status(200).send("Updated");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
