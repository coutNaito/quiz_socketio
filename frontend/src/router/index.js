import { createRouter, createWebHistory } from "vue-router";
import Testconnect from "../views/Testconnect.vue";

const routerHistory = createWebHistory();

const routes = [
  {
    path: "/",
    redirect: "/testconnect",
    component: Testconnect,
  },
];

const router = createRouter({
  history: routerHistory,
  routes,
});

export default router;
