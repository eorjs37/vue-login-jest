import { createRouter, createWebHistory } from 'vue-router';
import { checkToken } from '@/api/login';
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
    meta: { authRequired: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/LoginView.vue'),
  },
];

export const bfEach = async (to, from, next) => {
  try {
    if (to.matched.some(routeInfo => routeInfo.meta.authRequired)) {
      const { data } = await checkToken('test');
      const { success } = data;
      if (success === 'ok') {
        next();
      } else {
        next('/login');
      }
    }
    next();
  } catch (error) {
    // console.error('error  : ', error);
    alert('인증이 만료되었습니다.');
    next('/login');
  }
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(bfEach);

export default router;
