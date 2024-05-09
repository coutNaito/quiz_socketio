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
