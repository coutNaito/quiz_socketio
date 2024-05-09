<template>
  <div>
    <h2>Test Connection</h2>
    <button @click="testConnection">Test Connection</button>
    <div v-if="response">{{ response }}</div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      user_id: "12345600",
      room_id: "9874",
    };
  },
  created() {
    // Initialize socket inside the created hook
    this.socket = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    });

    this.socket.on("join_user", (displayname) => {
      console.log("Username is " + displayname)
    })

    this.socket.on("currentState", (currentState) => {
      //Change the components follow by currentState

    })

    this.socket.on("result", (answer, result, currentscore) => {
      //insert answer to data prepare for display
      //insert result to data prepare for display
      //insert result to data prepare for display
    })

    this.socket.on("show_answer", (show) => {
      //Display value from data
    })

    this.socket.on("question", () => {
      
    })

    this.socket.on("show_scoreboard", (player_score) =>{
      //Retive value from player_score
      //
    })

    this.socket.on("show_answer", (boolean) => {
      
    })

    // Handle socket events here
    this.socket.on("disconnect", (reason) => {
      console.log("[socket disconnected]: ", reason);
    });
    this.socket.on("connect_error", (error) => {
      console.error("[connect error]: ", error);
    });
    this.socket.on("verify-connection", (data) => {
      console.log("[verify-connection]: ", data);
      this.response = data;
    });
  },
  methods: {
    testConnection() {
      // You can access this.socket here
      this.socket.emit("create_room", "1234", "9874");
  },
  }
};
</script>

<style>
/* Add your styles here */
</style>
