<template>
  <form @submit.prevent="submit">
    <fieldset>
      <legend>회원가입</legend>
      이름 :
      <input id="name" data-label="이름" type="text" v-model="form.name" /> <br /><br />
      비밀번호 :
      <input id="password" data-label="비밀번호" type="password" v-model="form.password" /> <br /><br />
      이메일 :
      <input type="email" data-label="이메일" id="email" v-model="form.email" /> <br /><br />
      전화번호 :
      <input type="tel" data-label="전화번호" id="tel" v-model="form.tel" /> <br /><br />
      성별 :
      <input type="radio" data-label="성별" id="gender" value="men" v-model="form.gender" />남자 <input type="radio" id="gender" value="female" v-model="form.gender" />여자
    </fieldset>

    <button type="submit">회원가입</button>
  </form>
</template>
<script>
import { reactive } from 'vue';
import { saveProfile } from '@/api/login';
import { required, passwordValidate, emailValidate } from '@/utils/validate';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    const form = reactive({
      name: '',
      password: '',
      email: '',
      tel: '',
      gender: '',
    });

    const submit = () => {
      if (!required(form.name)) {
        alert('이름은 필수 값입니다.');
        return false;
      }

      if (!required(form.password)) {
        alert('비밀번호는 필수 값입니다.');
        return false;
      } else if (!passwordValidate(form.password)) {
        alert('비밀번호는 특수문자 / 문자 / 숫자 포함 형태의 8~15자리 가능합니다.');
        return false;
      }

      if (!required(form.email)) {
        alert('이메일은 필수 값입니다.');
        return false;
      } else if (!emailValidate(form.email)) {
        alert('이메일 양식을 확인해주세요.');
        return false;
      }

      if (!required(form.gender)) {
        alert('성별은 필수 값입니다.');
        return false;
      }

      if (!required(form.password)) {
        alert('비밀번호는 필수 값입니다.');
        return false;
      }

      saveProfile(form)
        .then(value => {
          const { status } = value;
          if (status === 201) {
            alert('회원가입되셨습니다.');
            router.push('/login');
          } else {
            alert('회원가입에 실패하였습니다.');
          }
        })
        .catch(err => {
          alert(`서버에 문제가 발생하였습니다.\n${JSON.stringify(err)}`);
        });
    };

    return {
      form,
      submit,
    };
  },
};
</script>
<style scoped></style>
