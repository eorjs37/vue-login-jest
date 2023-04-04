<template>
  <form @submit.prevent="submit">
    <fieldset>
      <legend>로그인</legend>
      ID : <input type="text" id="id" v-model="form.id" /> PW : <input type="password" id="password" v-model="form.pw" />

      <button type="submit" @click="submit">로그인</button>
    </fieldset>
  </form>
</template>
<script>
import { onMounted, reactive } from 'vue';
import { login, todoList } from '@/api/login.js';
import axios from 'axios';
export default {
  setup() {
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
          alert('로그인 되었습니다.');
        })
        .catch(err => {
          //error 작성
        })
        .finally(() => {
          //성공여부 상관없이 작업해야하는곳
        });
    };

    const loginApi = () => {};

    return {
      form,
      submit,
      loginApi,
    };
  },
};
</script>
<style></style>
