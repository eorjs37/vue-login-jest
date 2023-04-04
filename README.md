# 로그인 vue-jest

## 로그인 form 테스트 케이스 작성

---

### 1.id,pw 둘 중 하나 없을 경우

> form에서 id,pw가 비어있을 경우 alret를 호출 하고 alert호출을 하였는지 확인한다.

```javascript
import { shallowMount } from '@vue/test-utils';
import LoginView from '../LoginView.vue';
describe('Login.vue testing', () => {
  beforeEach(() => {
    wrapper = shallowMount(LoginView);
    //브라우저가 아니기 때문에 alert가 없다. 그러기때문에 가짜함수를 만들어준다.
    alert = jest.spyOn(window, 'alert').mockImplementation();
  });

  test('form submit할때 id 또는 pw가 비어있을 경우 alert', async () => {
    //id input
    await wrapper.find('input#id');

    //pw input
    await wrapper.find('input#password');

    //submit 클릭
    await wrapper.find('button[type=submit]').trigger('click');

    //호출하였는지 확인하기 위해 추가해준다.
    expect(alert).toBeCalled();
    //기존꺼를 지워주고 다른 단위테스트에서 새롭게 시작할 수 있도록 한다.
    alert.mockClear();
  });
});
```

## 2. 로그인 성공 할 경우

> id,pw으로 api를 호출할 경우 실제 api를 호출하는것 보다는, Prmoise으로 return해준다.  
> 실제 api를 호출하면 항상 성공한다는 보장이 없기 때문이다. 차라리 실패 케이스를 만들어준다.

```javascript
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

  test('form submit할때 id ,pw 둘다 있는경우 and 로그인 성공', async () => {
    //로그인 성공

    login.mockImplementation(() => {
      //실제 api호출하는 부분을 가짜 함수로 만들어주고, Promise으로 리턴해준다.
      return new Promise(resolve => {
        resolve({
          success: 'ok',
          token: 'mocktoken',
        });
      });
    });
    //id를 세팅해준다.
    await wrapper.find('input#id').setValue('chleorjs37@gmail.com');
    //password를 세팅해준다.
    await wrapper.find('input#password').setValue('chleorjs12@');
    //submit 클릭
    await wrapper.find('button[type=submit]').trigger('click');
    //toBeCalledWith 함수와 함께 alert에 추가된 인자와 같은지 확인해준다.
    expect(alert).toBeCalledWith('로그인 되었습니다.');
    alert.mockClear();
  });
});
```

## 3. 로그인 실패(로그인시 정보가 맞지 않는 경우)

> 로그인시 api를 호출하였으나, 정보가 맞지 않는 경우, 화면이동없이 'ID또는PW를 확인해주세요'와 함께 alert를 띄어준다.

```javascript
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
});
```

## 4. 로그인 실패(서버에서 에러가 발생한 경우)

> 로그인시 api를 호출하였으나, 서버에서 에러가 발생한 경우, Promise에서 reject으로 처리 한다.

```javascript
import { shallowMount } from '@vue/test-utils';
import LoginView from '../LoginView.vue';
import { login } from '@/api/login';
jest.mock('@/api/login');

describe('Login.vue testing', () => {
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
```
