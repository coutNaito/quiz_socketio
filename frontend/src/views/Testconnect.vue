<template>
  <div>
    <h2>Test Connection</h2>
    <button @click="testConnection">Test Connection</button>
    <div v-if="response">{{ response }}</div>
  </div>
</template>

<script>
import io from 'socket.io-client';
// เชื่อมต่อกับ socket
let socket = io("http://localhost:3000", {
        transports: ["websocket", "polling"],
      });

export default {
  data() {
    return {
      response: null,
    };
  },
  methods: {
    testConnection() {
      
      // กรณีการเชื่อมต่อถูกตัดขาด
      socket.on("disconnect", (reason) => {
        console.log("[socket disconnected]: ", reason);
      });
      // กรณีการเชื่อมต่อเกิดความผิดพลาด
      socket.on("connect_error", (error) => {
        console.error("[connect error]: ", error);
      });
    },
  },
};
</script>

<style>
/* Add your styles here */
</style>
