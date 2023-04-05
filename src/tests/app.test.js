import App from '../App.vue';
import { mount } from '@vue/test-utils';

describe('App.vue testing', () => {
  let wrapper = null;
  let push = null;
  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        stubs: ['router-link', 'router-view'],
      },
    });
  });

  test('should ', () => {});
});
