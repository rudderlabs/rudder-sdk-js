import { dispatchErrorEvent, getStacktrace } from '../../src/utilities/errors';

describe('Errors - utilities', () => {
  describe('dispatchErrorEvent', () => {
    const dispatchEventMock = jest.fn();
    const originalDispatchEvent = globalThis.dispatchEvent;

    beforeEach(() => {
      globalThis.dispatchEvent = dispatchEventMock;
    });

    afterEach(() => {
      globalThis.dispatchEvent = originalDispatchEvent;
    });

    it('should dispatch an error event', () => {
      const error = new Error('Test error');

      dispatchErrorEvent(error);

      expect(dispatchEventMock).toHaveBeenCalledWith(new ErrorEvent('error', { error }));
      expect((error.stack as string).endsWith('[SDK DISPATCHED ERROR]')).toBeTruthy();
    });

    it('should decorate stacktrace before dispatching error event', () => {
      const error = new Error('Test error');
      // @ts-expect-error need to set the value for testing
      error.stacktrace = error.stack;
      delete error.stack;

      dispatchErrorEvent(error);

      // @ts-expect-error need to check the stacktrace property
      expect((error.stacktrace as string).endsWith('[SDK DISPATCHED ERROR]')).toBeTruthy();
    });

    it('should decorate opera sourceloc before dispatching error event', () => {
      const error = new Error('Test error');
      // @ts-expect-error need to set the value for testing
      error['opera#sourceloc'] = error.stack;
      delete error.stack;

      dispatchErrorEvent(error);

      // @ts-expect-error need to check the opera sourceloc property
      expect((error['opera#sourceloc'] as string).endsWith('[SDK DISPATCHED ERROR]')).toBeTruthy();
    });
  });

  describe('getStacktrace', () => {
    it('should return stack if it is a string', () => {
      const error = new Error('Test error');
      expect(getStacktrace(error)).toBe(error.stack);
    });

    it('should return stacktrace if it is a string', () => {
      const error = new Error('Test error');
      // @ts-expect-error need to set the value for testing
      error.stacktrace = error.stack;
      delete error.stack;

      // @ts-expect-error need to check the stacktrace property
      expect(getStacktrace(error)).toBe(error.stacktrace);
    });

    it('should return opera sourceloc if it is a string', () => {
      const error = new Error('Test error');
      // @ts-expect-error need to set the value for testing
      error['opera#sourceloc'] = error.stack;
      delete error.stack;

      // @ts-expect-error need to check the opera sourceloc property
      expect(getStacktrace(error)).toBe(error['opera#sourceloc']);
    });

    it('should return undefined if none of the properties are strings', () => {
      const error = new Error('Test error');
      delete error.stack;

      expect(getStacktrace(error)).toBeUndefined();
    });

    it('should return undefined if stack is the same as name and message', () => {
      const error = new Error('Test error');
      error.stack = `${error.name}: ${error.message}`;

      expect(getStacktrace(error)).toBeUndefined();
    });
  });
});
