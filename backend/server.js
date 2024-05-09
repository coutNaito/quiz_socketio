const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");

dotenv.config();

const server = express();
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
server.use(express.json());
server.use(cors());

const port = 4000;
const httpServer = http.createServer(server);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin, you can specify your frontend URL here
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

// For quiz session
io.on("connection", (socket) => {
  console.log("user : " + socket.id + " connected");

  socket.on("create_room", (room_id) => {
    //Function query username
    console.log("user : " + socket.id + " create room ");
    //Read Room data from API
    //Call at localhost:3000/
    server.patch("http://localhost:3000/" + room_id, (req, res) => {
      console.log("room : " + room_id + " data : " + res);
    });
    //////////////////////////////
    socket.join(room_id);
    console.log("user : " + socket.id + " joined room : " + room_id);

    socket.broadcast
      .to(room_id)
      .emit("user : " + socket.id + " joined room : " + room_id);
  });

  // When a client disconnects
  socket.on("disconnect", () => {
    console.log("user : " + socket.id + " disconnected");
  });

  // Send data to all connected clients in realtime
  socket.on("sent-message", (message, room) => {
    if (room === null) {
      socket.broadcast.emit("new-message", message);
      console.log("message : " + message);
    } else {
      socket.broadcast.to(room).emit("new-message", message);
      console.log("message : " + message + " in room : " + room);
    }
  });
});

httpServer.listen(port, () => {
  console.log("running in port http://localhost:" + port);
});

module.exports = server;
