import { instance } from '@/axios/axios';
const login = data => {
  return instance.post('/api/ionic/user/login', data);
};
const todoList = () => {
  return instance.get(`/api/todo`);
};

const checkToken = token => {
  return instance.get('/api/token', {
    params: {
      token,
    },
  });
};

export { login, todoList, checkToken };
