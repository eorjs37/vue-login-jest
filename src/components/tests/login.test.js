import { shallowMount } from '@vue/test-utils';
import LoginView from '../LoginView.vue';
import { login } from '@/api/login';

jest.mock('@/api/login');

describe('Login.vue testing', () => {
  let wrapper = null;
  let alert = null;
  beforeEach(() => {
    wrapper = shallowMount(LoginView);
    alert = jest.spyOn(window, 'alert').mockImplementation();
  });

  test('form submit할때 id 또는 pw가 비어있을 경우 alert', async () => {
    await wrapper.find('input#id');

    await wrapper.find('input#password');

    await wrapper.find('button[type=submit]').trigger('click');

    expect(alert).toBeCalled();
    alert.mockClear();
  });

  test('form submit할때 id ,pw 둘다 있는경우 and 로그인 성공', async () => {
    //로그인 성공
    login.mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          data: {
            success: 'ok',
            token: 'mocktoken',
          },
        });
      });
    });
    await wrapper.find('input#id').setValue('chleorjs37@gmail.com');
    await wrapper.find('input#password').setValue('chleorjs12@');

    await wrapper.find('button[type=submit]').trigger('click');

    expect(alert).toBeCalledWith('로그인 되었습니다.');
    alert.mockClear();
  });

  test('로그인시 정보가 맞지 않는 경우', async () => {
    //로그인 실패
    login.mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          data: {
            success: 'fail',
          },
        });
      });
    });

    await wrapper.find('input#id').setValue('test@gmail.com');
    await wrapper.find('input#password').setValue('1q2w3e4r@');

    await wrapper.find('button[type=submit]').trigger('click');
    expect(alert).toBeCalledWith('ID또는PW를 확인해주세요');
    alert.mockClear();
  });

  //서버 에러 난 경우
  test('로그인 api에서 서버에러가 발생 한 경우', async () => {
    login.mockImplementation(() => {
      return new Promise((_, reject) => {
        reject({
          response: {
            status: 500,
          },
        });
      });
    });

    await wrapper.find('input#id').setValue('test@gmail.com');
    await wrapper.find('input#password').setValue('1q2w3e4r@');

    await wrapper.find('button[type=submit]').trigger('click');
    expect(alert).toBeCalledWith('서버에서 에러가 발생하였습니다.');
    alert.mockClear();
  });
});
