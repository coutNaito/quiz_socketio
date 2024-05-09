const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const { stringify } = require("querystring");
const fs = require("fs");

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(process.env.PathToServiceAccountKey),
});

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

class Room {
  constructor(room, host_socket_id) {
    this.room = room;
    this.state = "waiting";
    this.question_no = 0; //Current score
    this.player_scores = {}; //Keep socketId, userID, score
    this.answers = []; //sent to another server
    this.host_socket_id = host_socket_id; //host socket ID
  }
}

const rooms = {};

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin, you can specify your frontend URL here
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

// For quiz session
io.on("connection", (socket) => {
  console.log("user : " + socket.id + " connected");

  socket.on("create_room", (room_pin) => {
    //Function query username
    console.log("user : " + socket.id + " create room ");
    //Read Room data from API
    //Call at localhost:3000/
    axios
      .get(
        "http://localhost:3000/api/rooms/" + room_pin + "?source=websocket",
        {
          withCredentials: true,
          headers: {
            Authorization:
              "Bearer " +
              "I_am_the_Bone_of_my_Sword_Steel_is_my_Body_and_Fire_is_my_Blood._I_have_created_over_a_Thousand_Blades,_Unknown_to_Death,_Nor_known_to_Life._Have_withstood_Pain_to_create_many_Weapons_Yet_those_Hands_will_never_hold_Anything._So,_as_I_Pray--_Unlimited_Blade_Works",
          },
        }
      )
      .then((response) => {
        //console.log("room : " + room_pin + " data : " + JSON.stringify(response.data));
        console.log("room : " + room_pin);
        room_json = response.data;
        quiz_id = room_json.room.quiz;
        if (response.data.success) {
          rooms[response.data.room.room_pin] = new Room(
            response.data.room,
            socket.id
          );
        } else {
        }
      })
      .catch((error) => {
        console.error("Error fetching room data:", error);
      });
    //////////////////////////////
    socket.join(room_pin);
  });

  socket.on("join_room", (userID, roomPin) => {
    axios
      .patch(
        "http://localhost:3000/api/rooms/" + roomPin + "?source=websocket",
        { data: { user_id: userID } },
        {
          withCredentials: true,
          headers: {
            Authorization:
              "Bearer " +
              "I_am_the_Bone_of_my_Sword_Steel_is_my_Body_and_Fire_is_my_Blood._I_have_created_over_a_Thousand_Blades,_Unknown_to_Death,_Nor_known_to_Life._Have_withstood_Pain_to_create_many_Weapons_Yet_those_Hands_will_never_hold_Anything._So,_as_I_Pray--_Unlimited_Blade_Works",
          },
        }
      )
      .then(async (res) => {
        if (res.data.success) {
          const user = await admin.auth().getUser(userID);
          socket.broadcast.to(roomPin).emit("join_user", user.displayName);

          rooms[roomPin].room = res.data.room;

          rooms[roomPin].player_scores[socket.id] = {
            user_id: userID,
            score: 0,
          };
        } else {
          //todo
        }
      });
  });

  socket.on("state", (currentState, room_pin) => {
    if (currentState === "answer") {
      //State that can answer
      const question = rooms[room_pin].room.questions[question_no];
      socket.broadcast.to(roomPin).emit("currentState", currentState);
      socket.broadcast.to(roomPin).emit("question", question);

      if (question_no == 0) {
        axios
          .patch(
            "http://127.0.0.1:3000/api/rooms/start/" + rooms[room_pin].room._id,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization:
                  "Bearer " +
                  "I_am_the_Bone_of_my_Sword_Steel_is_my_Body_and_Fire_is_my_Blood._I_have_created_over_a_Thousand_Blades,_Unknown_to_Death,_Nor_known_to_Life._Have_withstood_Pain_to_create_many_Weapons_Yet_those_Hands_will_never_hold_Anything._So,_as_I_Pray--_Unlimited_Blade_Works",
              },
            }
          )
          .then((res) => {
            if (res.data.success) {
              rooms[room_pin].room = res.data.room;
            }
          });
      }

      if (socket.id === rooms[room_pin].host_socket_id) {
        rooms[room_pin].question_no += 1;

        axios
          .put(
            "http://127.0.0.1:3000/api/rooms/start/" + rooms[room_pin].room._id,
            {
              data: rooms[room_pin].answers,
            },
            {
              withCredentials: true,
              headers: {
                Authorization:
                  "Bearer " +
                  "I_am_the_Bone_of_my_Sword_Steel_is_my_Body_and_Fire_is_my_Blood._I_have_created_over_a_Thousand_Blades,_Unknown_to_Death,_Nor_known_to_Life._Have_withstood_Pain_to_create_many_Weapons_Yet_those_Hands_will_never_hold_Anything._So,_as_I_Pray--_Unlimited_Blade_Works",
              },
            }
          )
          .then((res) => {
            if (res.data.success) {
              rooms[room_pin].answers = [];
            }
          });
      }
    } else if (currentState === "correction") {
      socket.broadcast.to(room_pin).emit("show_answer", true);
    } else if (currentState === "scoreboard") {
      socket.broadcast
        .to(room_pin)
        .emit("show_scoreboard", rooms[room_pin].player_scores);
    } else if (currentState === "summary") {
      socket.broadcast
        .to(room_pin)
        .emit("show_scoreboard", rooms[room_pin].player_scores);
    }
  });

  socket.on("answer", (user_id, room_pin, answer, time_usage) => {
    //Sent result to player after recieve input
    const correct =
      answer === rooms[room_pin].room.question[question_no].answer.value;
    rooms[room_pin].answers.push({
      user_id: user_id,
      answer: answer,
      correct: correct,
      time_usage: time_usage,
    });
    const score =
      ((rooms[room_pin].room.time_usage - time_usage) /
        rooms[room_pin].room.time_usage) *
        500 +
      500 * (correct ? 1 : 0);
    rooms[room_pin].player_scores[socket.id].score += score;
    socket
      .to(socket.id)
      .emit(
        "result",
        rooms[room_pin].room.question[question_no].answer.value,
        correct,
        rooms[room_pin].player_scores[socket.id].score
      );
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
