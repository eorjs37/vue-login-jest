import axios from 'axios';
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 12000,
  headers,
});

instance.interceptors.request.use(config => {
  return config;
});

export { instance };
