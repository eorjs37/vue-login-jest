import { shallowMount } from '@vue/test-utils';
import JoinView from '../JoinView.vue';
import { required, passwordValidate, emailValidate } from '@/utils/validate';
import { saveProfile } from '@/api/login';

jest.mock('@/api/login');
jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('회원가입 testing', () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = shallowMount(JoinView);
  });

  test('input[id=name] 이름은 필수값체크', async () => {
    const name = wrapper.find('#name');
    await name.setValue('');
    //유효성 검사
    const result = required(name.element.value);
    if (!result) {
      alert('이름은 필수 값입니다.');
    }

    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('input[id=password] 비밀번호는 필수값 체크과 ', async () => {
    const password = wrapper.find('#password');
    await password.setValue('');
    //유효성 검사
    const result = required(password.element.value);

    if (!result) {
      alert('비밀번호는 필수 값입니다.');
    }

    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('input[id=password] 비밀번호는 특수문자 / 문자 / 숫자 포함 형태의 8~15자리 이내의 암호 정규식', async () => {
    const password = wrapper.find('#password');
    await password.setValue('chleorjs12');

    const result = passwordValidate(password.element.value);

    if (!result) {
      alert('비밀번호는 특수문자 / 문자 / 숫자 포함 형태의 8~15자리 가능합니다');
    }
    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('input[id=email] 이메일은 필수값체크', async () => {
    const email = wrapper.find('#email');
    await email.setValue('');
    //유효성 검사
    const result = required(email.element.value);
    if (!result) {
      alert('이메일은 필수 값입니다.');
    }

    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('input[id=email] 이메일이 이메일 양식체크', async () => {
    const email = wrapper.find('#email');
    await email.setValue('ddd');

    const result = emailValidate(email.element.value);
    if (!result) {
      alert('이메일 양식을 확인해주세요.');
    }

    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('input[id=tel] 전화번호는 필수값체크', async () => {
    const tel = wrapper.find('#tel');
    await tel.setValue('');
    //유효성 검사
    const result = required(tel.element.value);
    if (!result) {
      alert('전화번호는 필수 값입니다.');
    }

    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('input[id=gender] 성별은 필수값체크', async () => {
    const gender = wrapper.find('#gender');
    //유효성 검사
    const result = required(gender.element.checked);
    if (!result) {
      alert('성별은 필수 값입니다.');
    }

    expect(alert).toHaveBeenCalled();
    alert.mockClear();
  });

  test('form에서 모든 값이 있을 경우 회원가입을 실행한다.', async () => {
    saveProfile.mockImplementation(() => {});

    await wrapper.find('#name').setValue('홍길동');
    await wrapper.find('#password').setValue('chleorjs12@');
    await wrapper.find('#email').setValue('chleorjs37@gmail.com');
    await wrapper.find('#tel').setValue('010-2908-3509');
    await wrapper.find('#gender[value=men]').setValue();

    await wrapper.find('form').trigger('submit.prevent');
    await expect(saveProfile).toHaveBeenCalled();
  });
});