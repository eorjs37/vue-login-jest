<template>
  <form @submit.prevent="submit">
    <fieldset>
      <legend>로그인</legend>
      ID : <input type="text" id="id" v-model="form.id" /> PW : <input type="password" id="password" v-model="form.pw" />

      <button type="submit">로그인</button>
    </fieldset>
  </form>
</template>
<script>
import { reactive } from 'vue';
import { login } from '@/api/login.js';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const form = reactive({
      id: '',
      pw: '',
    });
    const submit = async () => {
      if (!form.id || !form.pw) {
        alert('ID 또는 Pw를 입력해주세요');
        return false;
      }

      login({
        UserId: form.id,
        PassWord: form.pw,
      })
        .then(res => {
          //response작성
          const { success, token } = res.data;
          if (success === 'ok') {
            alert('로그인 되었습니다.');
            store.commit('setAccessToken', token);
            router.push('/main');
          } else {
            alert('ID또는PW를 확인해주세요');
          }
        })
        .catch(err => {
          //error 작성
          alert('서버에서 에러가 발생하였습니다.');
        })
        .finally(() => {
          //성공여부 상관없이 작업해야하는곳
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
