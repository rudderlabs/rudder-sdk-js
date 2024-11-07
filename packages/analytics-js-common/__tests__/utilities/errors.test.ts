import { dispatchErrorEvent } from '../../src/utilities/errors';

describe('Errors - utilities', () => {
  describe('dispatchErrorEvent', () => {
    it('should dispatch an error event', () => {
      const dispatchEvent = jest.fn();
      globalThis.dispatchEvent = dispatchEvent;
      const error = new Error('Test error');
      dispatchErrorEvent(error);
      expect(dispatchEvent).toHaveBeenCalledWith(new ErrorEvent('error', { error }));
    });
  });
});
