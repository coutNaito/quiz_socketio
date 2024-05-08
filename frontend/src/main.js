import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./store/store.js";

import router from "./router";

const app = createApp(App);

app.use(router);
app.use(store);
app.mount("#app");
