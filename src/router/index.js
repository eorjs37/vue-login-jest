import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'helloworld',
    component: () => import('../components/HelloWorld.vue'),
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../components/Main.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/LoginView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
