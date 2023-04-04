import { instance } from '@/axios/axios';
const login = data => {
  return instance.post('/api/ionic/user/login', data);
};
let todoList = () => {
  return instance.get(`/api/todo`);
};

export { login, todoList };
