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
      response: null,
      socket: null, // Initialize socket property
    };
  },
  created() {
    // Initialize socket inside the created hook
    this.socket = io("http://localhost:3000", {
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
    },
  },
};
</script>

<style>
/* Add your styles here */
</style>
