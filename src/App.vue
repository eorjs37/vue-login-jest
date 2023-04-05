<template>
  <nav><router-link to="/">Home</router-link> |</nav>
  <button @click="pushRouter()">라우터 이동</button>
  <router-view />
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  name: 'App',
  setup() {
    const router = useRouter();

    const pushRouter = () => {
      router.push('/login');
    };

    return {
      pushRouter,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
