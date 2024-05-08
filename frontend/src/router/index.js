import { createRouter, createWebHistory } from "vue-router";
import Testconnect from "../views/Testconnect.vue";
import Testchat from "../views/Simplechat.vue";

const routerHistory = createWebHistory();

const routes = [
  {
    path: "/",
    redirect: "/testconnect",
    component: Testconnect,
  },
  {
    path: "/testconnect",
    name: "Testconnect",
    component: Testconnect,
  },
  {
    path: "/testchat",
    name: "Testchat",
    component: Testchat,
  },
];

const router = createRouter({
  history: routerHistory,
  routes,
});

export default router;
