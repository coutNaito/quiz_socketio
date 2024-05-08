import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    socket: null,
    isConnected: false,
  },
  mutations: {
    // For editing the state
    initializeSocket(state) {
      state.socket = io("http://localhost:3000");
      state.isConnected = true;

      state.socket.on("disconnect", () => {
        state.isConnected = false;
      });
    },
  },
});

export default store;
