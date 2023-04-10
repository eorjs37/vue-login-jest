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

### 2-1. 로그인 완료 후 라우터 mocking으로 화면 이동하기

> 로그인 완료 후 useRouter를 mocking한 후 push 하기

```javascript
import { shallowMount } from '@vue/test-utils';
import LoginView from '../LoginView.vue';
import { login } from '@/api/login';
import { useRouter } from 'vue-router';
jest.mock('@/api/login');
//vue-router를 통째로 mock한 후 useRouter를 빈 함수로 생성
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));
describe('Login.vue testing', () => {
  let wrapper = null;
  let alert = null;
  let push = null;

  beforeEach(() => {
    push = jest.fn();
    //한번만 호출 구현
    useRouter.mockImplementation(() => ({
      push,
    }));
    wrapper = shallowMount(LoginView);
    alert = jest.spyOn(window, 'alert').mockImplementation();
  });

  test('form submit할때 id ,pw 둘다 있는경우 and 로그인 성공 후 main으로 이동', async () => {
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

    await expect(alert).toBeCalledWith('로그인 되었습니다.');
    //가짜 router으로 이동 확인
    // router.push를 호출하였는지 확인
    expect(push).toHaveBeenCalled();
    // router.push를 호출하였을때 '/main'을 호출하였는지 확인
    expect(push).toHaveBeenCalledWith('/main');
    alert.mockClear();
  });
});
```

### 2-2. 로그인 완료 후 store에 commit을 통해 token저장

> 로그인 완료 후 useStore를 mocking한 후 commit 하기

```javascript
import { useStore } from 'vuex';
//vue-router를 mock한 후 useRouter를 jest.fn으로 가짜 함수 만들기
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

test(('로그인 성공 완료 후 토큰은 vuex에 저장하기')=>{
  //이미 로그인 로직이 성공적으로 됐다는 전제하에 작성하였습니다.
  // store.commit('setAccessToken',리턴받은가짜토큰) 입니다.
  // toHaveBeenCalledWith으로 호출할 경우 첫번째 인자에는 store의 mutations에서 어떤 함수를 호출하였는가이고 , 두번째 인자는 token값입니다.
  expect(commit).toHaveBeenCalledWith('setAccessToken', 'mocktoken');
})
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

---

## router 권한체크 테스트 케이스 작성

store/index.js를 작성 해준다.

```javascript
//store/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { checkToken } from '@/api/login';
const routes = [
  {
    path: '/',
    name: 'helloworld',
    component: () => import('../components/HelloWorld.vue'),
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../components/Main.vue'),
    meta: { authRequired: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/LoginView.vue'),
  },
];

export const bfEach = async (to, from, next) => {
  try {
    if (to.matched.some(routeInfo => routeInfo.meta.authRequired)) {
      const { data } = await checkToken('test');
      const { success } = data;
      if (success === 'ok') {
        next();
      } else {
        next('/login');
      }
    }
    next();
  } catch (error) {
    // console.error('error  : ', error);
    alert('인증이 만료되었습니다.');
    next('/login');
  }
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(bfEach);

export default router;
```

---

### 1.화면 진입 전에 token 체크 후 인증되었을 경우

> 화면마다 권한이 필요한 경우가 있다.권한이 있는경우 권한을 확인한 후  
> 진입할수 있도록 한다.

```javascript
//라우터 진입하기전에 만든 함수인 bfEach이다.
import { bfEach } from '../index';
//토큰을 조회 할 수 있는 checkToken 이다.
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
    //bfEach는 to,from,next 새 개의 인자를 받는다.
    //to 안에는 권한을 필수로 받을 경우 처리한다.
    bfEach(to, from, next);
    //checkToken를 호출했는지 확인한다.
    await expect(checkToken).toHaveBeenCalled();
    //checkToken를 통해 인증이 되었다면, next를 통해 다음 화면으로 이동한다.
    expect(next).toHaveBeenCalled();
  });
});
```

### 2.화면진입 전에 token 체크 후 인증실패 할 경우 login 으로 이동

> token을 조회하였을때 error가 날 경우 인증만료로 처리한다.

```javascript
//라우터 진입하기전에 만든 함수인 bfEach이다.
import { bfEach } from '../index';
//토큰을 조회 할 수 있는 checkToken 이다.
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

  test('화면진입 전에 token 체크 후 인증실패 할 경우 login 으로 이동', async () => {
    const to = {
      matched: [{ meta: { authRequired: true } }],
    };
    //에러를 리턴한다.
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
    //토큰 api를 호출하였는지 확인한다.
    await expect(checkToken).toHaveBeenCalled();
    //토큰 api를 호출하여 실패하였으니, login으로 이동한다.
    expect(next).toHaveBeenCalledWith('/login');
    expect(alert).toBeCalledWith('인증이 만료되었습니다.');
    alert.mockClear();
  });
});
```

### 3.meta에 authRequired가 없을 경우 next만 호출

> 권한체크가 필요없는 화면의 경우 바로 next으로 다음화면을 이동한다.

```javascript
import { bfEach } from '../index';
import { checkToken } from '@/api/login';

describe('router testing', () => {
  let from = null;
  let next = null;
  beforeEach(() => {
    from = jest.fn();
    next = jest.fn();
  });
  test('meta에 authRequired가 없을 경우 next만 호출', () => {
    const to = null;
    bfEach(to, from, next);
    expect(next).toHaveBeenCalled();
  });
});
```

---

## 회원가입 form 테스트 케이스 작성

### beforeEach 작업

test를 실행하기 전에 작업해야 할 부분이 있으면 작업한다.

```javascript
import { shallowMount } from '@vue/test-utils';
import JoinView from '../JoinView.vue';
import { required, passwordValidate, emailValidate } from '@/utils/validate'; //validation 체크 함수
import { saveProfile } from '@/api/login'; //회원가입 api
import { useRouter } from 'vue-router'; // router
jest.mock('@/api/login');
jest.spyOn(window, 'alert').mockImplementation(() => {});
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));
describe('회원가입 testing', () => {});
```

### 이름 필수 값 체크

> input[id=name]을 찾아서 빈값인지 확인후 alert를 띄운다

```javascript
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
```

### 비밀번호 필수값 체크 and 특수문자 / 문자 / 숫자 포함 형태의 8~15자리 이내의 암호 정규식

#### 비밀번호 필수값 체크

> 이름과 마찬가지로 비밀번호 빈값을 체크한다.

```javascript
test('input[id=password] 비밀번호는 필수값 체크 ', async () => {
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
```

#### 특수문자 / 문자 / 숫자 포함 형태의 8~15자리 이내의 암호 정규식 체크

> 비밀번호 정규식을 확인한다

```javascript
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
```

### 이메일 필수값체크 and 이메일 양식 체크

#### 이메일 필수값 체크

> 이메일이 빈값이 있는지 확인한다.

```javascript
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
```

#### 이메일 양식 체크

```javascript
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
```

### 전화번호 필수값체크

> 전화번호 필수값 체크를 한다.

```javascript
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
```

### 성별 필수값체크

> 성별은 radio 박스 이므로 checked으로 검사한다

```javascript
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
```

### form validation 완료 후 성공적으로 response를 받았을 경우

> 서버에서 response를 201로 받았을 경우 alert과 함께 router으로 이동하였는지 확인한다.

```javascript
test('form에서 모든 값이 있을 경우 회원가입을 실행하고 response를 201로 받았을 경우', async () => {
  saveProfile.mockImplementation(() => {
    return new Promise(resolove => {
      resolove({
        status: 201,
      });
    });
  });

  await wrapper.find('#name').setValue('홍길동');
  await wrapper.find('#password').setValue('chleorjs12@');
  await wrapper.find('#email').setValue('chleorjs37@gmail.com');
  await wrapper.find('#tel').setValue('01029083509');
  await wrapper.find('#gender[value=men]').setValue();

  await wrapper.find('form').trigger('submit.prevent');
  await expect(saveProfile).toHaveBeenCalled();
  expect(alert).toBeCalledWith('회원가입되셨습니다.');
  alert.mockClear();
  // router.push를 호출하였는지 확인
  expect(push).toHaveBeenCalledWith('/login');
});
```

### form validation 완료 후 response를 500으로 받았을 경우

> 서버에서 500으로 떨어질 경우 화면이동하지 않고 alert만 띄어준다.

```javascript
test('form에서 모든 값이 있을 경우 회원가입을 실행하고 response를 500으로 받았을 경우', async () => {
  saveProfile.mockImplementation(() => {
    return new Promise((_, reject) => {
      reject({
        status: 500,
        message: '서버에 문제가 발생하였습니다.',
      });
    });
  });
  await wrapper.find('#name').setValue('홍길동');
  await wrapper.find('#password').setValue('chleorjs12@');
  await wrapper.find('#email').setValue('chleorjs37@gmail.com');
  await wrapper.find('#tel').setValue('01029083509');
  await wrapper.find('#gender[value=men]').setValue();

  await wrapper.find('form').trigger('submit.prevent');
  await expect(saveProfile).toHaveBeenCalled();
  expect(alert).toBeCalledWith('서버에 문제가 발생하였습니다.');
  alert.mockClear();
});
```
