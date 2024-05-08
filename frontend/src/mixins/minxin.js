import io from "socket.io-client";
export default {
  data() {
    return {
      socket: null,
      socketioURL: "http://localhost:3000",
    };
  },
  async mounted() {
    // Connect Socket
    this.socket = io(socketioURL, {
      transports: ["websocket", "polling"],
    });
    this.socket.on("connect", () => {
      console.log("[socket connected]: ", this.socket.connected);
    });
    this.socket.on("eventName", (data) => {
      // Do something
      console.error("[data]: ", data);
    });
    this.socket.on("disconnect", (reason) => {
      console.log("[socket disconnected]: ", reason);
    });
    this.socket.on("connect_error", (error) => {
      console.error("[connect error]: ", error);
    });
  },
  methods: {
    emitEvent(args) {
      /* Emit events */
      this.socket.emit("eventName", args, (response) => {
        /* Handle response, if any */
        console.log("response: ", response);
      });
    },
  },
  beforeDestroy() {
    // For a specific event
    this.socket.removeAllListeners(["eventName"]);
    // For all events
    this.socket.removeAllListeners();
    // Disconnect socket
    this.socket.disconnect();
  },
};
