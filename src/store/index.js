import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
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
  plugins: [createPersistedState()],
});

export { store };
