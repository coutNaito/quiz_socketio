<template>
    <div>
      <h2>Chat</h2>
      <div v-for="(message, index) in messages" :key="index">{{ message }}</div>
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
      <button @click="sendMessage">Send</button>
      <input type="text" v-model="roomName" placeholder="Enter room name...">
      <button @click="joinRoom">Join Room</button>
      <button @click="">To chat</button>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
      };
    },
    created() {
      // Replace 'http://localhost:3000' with your server URL
      this.socket = io("http://localhost:4000", {
        transports: ["websocket", "polling"],
      });
  
      // Listen for incoming messages from the server
      this.socket.on('new-message', (message) => {
        this.messages.push(message);
      });
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          // Send the message to the server
          this.socket.emit('sent-message', this.newMessage, this.roomName);
          // Clear the input field after sending the message
          this.newMessage = '';
        }
      },
      joinRoom() {
        // Join a room
        this.socket.emit('join-room', this.roomName);
      },
    },
    beforeUnmount() {
      // Disconnect the socket when the component is unmounted
      if (this.socket) {
        this.socket.disconnect();
        console.log("Socket disconnected")
      }
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  