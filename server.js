const express = require("express");
const app = express();
const server = require("http").Server(app);

const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./.env.local" });
const connectDb = require("./utilsServer/connectDb");
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(server);
const {
  addUser,
  removeUser,
  findConnectedUser,
} = require("./utils/roomActions");
const {
  loadTexts,
  sendText,
  setMessageToUnread,
  getUserInfo,
} = require("./utils/messageActions");

connectDb();
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("join", async ({ userId }) => {
    const users = await addUser(userId, socket.id);

    setInterval(() => {
      socket.emit("connectedUsers", {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on("loadTexts", async ({ userId, textsWith }) => {
    const { chat, error, textsWithDetails } = await loadTexts(
      userId,
      textsWith
    );
    if (!error) {
      socket.emit("textsLoaded", { chat, textsWithDetails });
    }
  });

  socket.on("sendNewText", async ({ userId, userToTextId, text }) => {
    const { newText, error } = await sendText(userId, userToTextId, text);
    const { userDetails } = await getUserInfo(newText.sender);
    const receiverSocket = findConnectedUser(userToTextId);

    if (receiverSocket) {

      io.to(receiverSocket.socketId).emit("newTextReceived", {
        newText,
        userDetails,
      });
    } else {
      await setMessageToUnread(userToTextId);
    }

    if (!error) {
      socket.emit("textSent", { newText });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});


nextApp.prepare().then(() => {
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/auth", require("./api/auth"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/notifications", require("./api/notifications"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/chats", require("./api/chats"));

  app.all("*", (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Express server running on ${PORT}`);
  });
});

