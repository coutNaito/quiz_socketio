const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = express();
const port = 4000;

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const httpServer = http.createServer(server);

server.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin, you can specify your frontend URL here
    methods: ["GET", "POST"], // Allow only GET and POST requests
  },
});

//Connect to MongoDB

///////////////////

//Connect to firebase

// For quiz session
io.on("connection", (socket) => {
  console.log("user : " + socket.id + " connected");

  socket.on("create_room", (user_id, room_id) => {
    //Function query username
    console.log("user :" + socket.id + "create room ");
    //Read Room data from database

    //////////////////////////////
    //temp variable after read room
    var room = 1234;
    //join room (socket)
    socket.join(room);
    console.log("user : " + socket.id + " joined room : " + room);

    socket.broadcast.to(room).emit("new-message", room.toString());
  });

  //Player join room
  socket.on("join_room", (user_id) => {
    console.log("user :" + socket.id + "join room ");
  });

  // When a client disconnects
  socket.on("disconnect", () => {
    console.log("user : " + socket.id + " disconnected");
  });

  // Send data to all connected clients in realtime
  socket.on("sent-message", (message, room) => {
    if (room === "") {
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
