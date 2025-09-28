import { createRouter, createWebHistory } from "vue-router";
import CourseCatalog from "./views/CourseCatalog.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/",
      name: "home",
      component: CourseCatalog,
    },
  ],
});

export default router;
