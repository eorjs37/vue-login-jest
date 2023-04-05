import { bfEach } from '../index';
import { checkToken } from '@/api/login';

jest.mock('@/api/login');

describe('router testing', () => {
  let from = null;
  let next = null;
  let alert = null;
  beforeEach(() => {
    from = jest.fn();
    next = jest.fn();
    alert = jest.spyOn(window, 'alert').mockImplementation();
  });
  test('화면 진입 전에 token 체크 후 인증되었을 경우', async () => {
    const to = {
      matched: [{ meta: { authRequired: true } }],
    };
    checkToken.mockImplementation(() => {
      return new Promise(resolve => {
        resolve({
          data: {
            success: 'ok',
            token: 'testtoken',
          },
        });
      });
    });
    bfEach(to, from, next);
    await expect(checkToken).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('화면진입 전에 token 체크 후 인증실패 할 경우 login 으로 이동', async () => {
    const to = {
      matched: [{ meta: { authRequired: true } }],
    };
    checkToken.mockImplementation(() => {
      return new Promise((_, reject) => {
        reject({
          err: {
            name: 'JsonWebTokenError',
            message: 'jwt malformed',
          },
          msg: '유효하지 않는 토큰',
        });
      });
    });
    bfEach(to, from, next);
    await expect(checkToken).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith('/login');
    expect(alert).toBeCalledWith('인증이 만료되었습니다.');
    alert.mockClear();
  });

  test('meta에 authRequired가 없을 경우 next만 호출', () => {
    const to = null;
    bfEach(to, from, next);
    expect(next).toHaveBeenCalled();
  });
});
