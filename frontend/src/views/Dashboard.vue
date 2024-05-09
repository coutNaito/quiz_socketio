<template>
    <div class="dashboard">
      <!-- Room PIN display -->
      <div class="room-pin">
        <h2>Room PIN</h2>
        <p>{{ roomPin }}</p>
      </div>
  
      <!-- List of users joined -->
      <div class="user-list">
        <h2>Users Joined</h2>
        <ul>
          <li v-for="(user, index) in users" :key="index">{{ user.username }}</li>
        </ul>
      </div>
  
      <!-- Start button -->
      <button @click="startGame">Start Game</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        roomPin: '123456', // Example room PIN
        users: [], // Array to store users who have joined the room
      };
    },
    created(){
        this.socket = io("http://localhost:4000", {
        transports: ["websocket", "polling"],
      });
    },
    methods: {
      startGame() {
        // Redirect to another Vue component for the game interface
        this.$router.push('/game');
      },
    },
  };
  </script>
  