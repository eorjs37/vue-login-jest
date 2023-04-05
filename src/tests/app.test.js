import App from '../App.vue';
import { mount } from '@vue/test-utils';
import { useRouter } from 'vue-router';
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

describe('App.vue testing', () => {
  let wrapper = null;
  let push = null;
  beforeEach(() => {
    push = jest.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));
    wrapper = mount(App, {
      global: {
        stubs: ['router-link', 'router-view'],
      },
    });
  });

  test('should ', async () => {
    await wrapper.find('button').trigger('click');

    expect(push).toHaveBeenCalled();
  });
});
