const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
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

//Connect to MongoDB
async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_Name}`);

  const QuizModel = require("./models/quiz.model");
  const RoomModel = require("./models/room.model");

  server.get("/", (req, res) => {
    res.status(200).send("connected backend successfully!");
  });

  const verifyFirebaseToken = require("./middlewares/auth.middleware");
  const quizRouter = require("./routes/quiz.route");
  const roomRouter = require("./routes/room.route");

  server.use("/api/quizzes", verifyFirebaseToken, quizRouter);
  server.use("/api/rooms", roomRouter);
}

main().catch((err) => console.log(err));

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin, you can specify your frontend URL here
    methods: ["GET", "POST"], // Allow only GET and POST requests
  },
});

///////////////////

//Connect to firebase

//Declare variable for quiz session
const { QuizModel, RelatedQuizModel } = require("./models/quiz.model.js");

// For quiz session
io.on("connection", (socket) => {
  console.log("user : " + socket.id + " connected");

  socket.on("create_room", async (user_id, room_id) => {
    //Function query username
    console.log("user : " + socket.id + " create room ");
    //Read Room data from database
    const quizzes = await QuizModel.findOne({}).lean();
    const room = await RoomModel.findOne({
      room_id: room_id,
      user_id: user_id,
      quiz_id: quizzes._id,
    });
    //////////////////////////////
    //temp variable after read room
    var room_socket = 1234;
    //join room (socket)
    socket.join(room_socket);
    console.log("user : " + socket.id + " joined room : " + room_socket);

    socket.broadcast
      .to(room_socket)
      .emit("new-message", room_socket.toString());
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
