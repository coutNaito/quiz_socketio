const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const server = express();
const port = 3000;

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const httpServer = http.createServer(server);

const io = new Server(httpServer);

// Wait for connections from clients
io.on("connection", (socket) => {
  console.log("user : " + socket.id + " connected");

  // When a client disconnects
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Send data to all connected clients in realtime
  socket.on("sent-message", (message) => {
    io.emit("new-message", message);
  });
});

httpServer.listen(port, () => {
  console.log("running in port http://localhost:" + port);
});

module.exports = server;
