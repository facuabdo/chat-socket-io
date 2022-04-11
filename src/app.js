import express from "express";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(process.env.port || 8080, () => {
  console.log("Server running");
});

const io = new Server(server);

let messages = [];

io.on("connection", (socket) => {
  console.log("Se conectó el usuario " + socket.id);

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("log", messages);
  });

  socket.on("userConnect", (user) => {
    io.emit("userConnect", { id: socket.id, user: user.name });
  });
});
