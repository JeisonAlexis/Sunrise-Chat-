const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Chat App APIs...");
});


const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) =>
    console.log("MongoDB connection failed:", error.message)
  );


const http = require("http");
const { Server } = require("socket.io");


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("addNewUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Usuarios en línea:", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", (data) => {
    console.log("Mensaje recibido por el servidor:", data);

    const receiverSocketId = onlineUsers.get(data.recipientId);
    console.log("socket del receptor:", receiverSocketId);

    if (receiverSocketId) {
      
      const notification = {
        _id: new mongoose.Types.ObjectId(),
        senderId: data.senderId,
        chatId: data.chatId,
        text: data.text,
        date: new Date(),
      };

      
      io.to(receiverSocketId).emit("getNotification", notification);
      console.log("Notificación enviada:", notification);

      
      io.to(receiverSocketId).emit("getMessage", data); 
      console.log("Mensaje enviado en tiempo real:", data);
    } else {
      console.log("Receptor no conectado:", data.recipientId);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});


const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
