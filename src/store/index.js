import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      accessToken: '',
    };
  },
  getters: {
    getToken(state) {
      return state.accessToken;
    },
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  actions: {},
});

export { store };
