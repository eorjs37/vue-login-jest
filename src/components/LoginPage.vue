<!-- LoginPage.vue -->
<template>
  <div>
    <form @submit.prevent="submit">
      <label>Id :</label>
      <input type="text" id="id" v-model="form.id" /> <br /><br />

      <label>Pw :</label>
      <input type="password" id="password" v-model="form.password" /> <br /><br />
    </form>
  </div>
</template>
<script>
import { reactive } from 'vue';
import { login } from '@/api/login';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const form = reactive({
      id: '',
      password: '',
    });

    const router = useRouter();

    const submit = () => {
      if (!form.id || !form.password) {
        alert('id또는 pw를 확인해주세요.');
        return false;
      }

      login({
        UserId: form.id,
        PassWord: form.password,
      })
        .then(value => {
          const { status, data } = value;
          if (status === 201) {
            alert('로그인 되었습니다.');
            router.push('/main');
          }
        })
        .catch(err => {
          const { status, code } = err;
          if (status === 500 && code === 'NOT_VALID') {
            alert('로그인 정보를 확인해주세요.');
          } else if (status === 500) {
            alert('서버에서 에러가 발생하였습니다.');
          }
        });
    };

    return {
      form,
      submit,
    };
  },
};
</script>
<style></style>
