//loginpage.test.js
import LoginPage from '../LoginPage.vue';
import { shallowMount } from '@vue/test-utils';
import { login } from '@/api/login';
import { useRouter } from 'vue-router';
//alert 가짜 함수 만들기
jest.spyOn(window, 'alert').mockImplementation(() => {});
//api/login을 전체로 mock 만들기
jest.mock('@/api/login');
//vue-router mock
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));
describe('LoginPage.vue 단위테스트', () => {
  let wrapper = null;
  let push = null;
  beforeEach(() => {
    push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));
    wrapper = shallowMount(LoginPage);
  });
  test('id/pw 비어있을 경우 alert을 띄운다.', async () => {
    await wrapper.find('form').trigger('submit.prevent');

    expect(alert).toBeCalledWith('id또는 pw를 확인해주세요.');
    alert.mockClear();
  });

  test('id/pw 입력 후 성공적으로 끝날 경우 main으로 이동', async () => {
    login.mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          status: 201,
        });
      });
    });
    await wrapper.find('#id').setValue('chleorjs37@gmail.com');
    await wrapper.find('#password').setValue('testpassword');

    await wrapper.find('form').trigger('submit.prevent');

    await expect(login).toHaveBeenCalled();
    expect(alert).toBeCalledWith('로그인 되었습니다.');
    expect(push).toHaveBeenCalledWith('/main');
    alert.mockClear();
  });

  test('로그인시 정보가 맞지 않는 경우', async () => {
    login.mockImplementation(() => {
      return new Promise((_, reject) => {
        reject({
          status: 500,
          code: 'NOT_VALID',
        });
      });
    });

    await wrapper.find('#id').setValue('chleorjs37@gmail.com');
    await wrapper.find('#password').setValue('testpassword');

    await wrapper.find('form').trigger('submit.prevent');

    expect(alert).toBeCalledWith('로그인 정보를 확인해주세요.');
    alert.mockClear();
  });

  test('로그인 api에서 서버에러가 발생 한 경우', async () => {
    login.mockImplementation(() => {
      return new Promise((_, reject) => {
        reject({
          status: 500,
        });
      });
    });
    await wrapper.find('#id').setValue('chleorjs37@gmail.com');
    await wrapper.find('#password').setValue('testpassword');

    await wrapper.find('form').trigger('submit.prevent');

    expect(alert).toBeCalledWith('서버에서 에러가 발생하였습니다.');
  });
});
