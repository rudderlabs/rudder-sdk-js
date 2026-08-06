import { resetState, state } from '../../src/state';

describe('application state', () => {
  afterEach(() => {
    resetState();
  });

  it('initializes custom context as empty', () => {
    expect(state.customContext.value).toEqual({});
  });

  it('restores custom context to empty on full state reset', () => {
    state.customContext.value = {
      account: {
        plan: 'enterprise',
      },
    };

    resetState();

    expect(state.customContext.value).toEqual({});
  });
});
