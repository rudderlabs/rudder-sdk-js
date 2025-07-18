import { dispatchErrorEvent, getStacktrace, getMutatedError } from '../../src/utilities/errors';

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
  });

  describe('getMutatedError', () => {
    it('should create a new Error when input is not an Error type', () => {
      const nonError = { message: 'Not an error object' };
      const issue = 'Test Issue';

      const result = getMutatedError(nonError, issue);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Test Issue: {"message":"Not an error object"}');
      expect(result).not.toBe(nonError);
    });

    it('should preserve error type when input is a specific Error subclass', () => {
      const originalError = new TypeError('Original message');
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue);

      expect(result).toBeInstanceOf(TypeError);
      expect(result.message).toBe('Test Issue: Original message');
      expect(result).not.toBe(originalError); // Should be immutable
    });

    it('should preserve error type for ReferenceError', () => {
      const originalError = new ReferenceError('Variable not defined');
      const issue = 'Reference Issue';

      const result = getMutatedError(originalError, issue);

      expect(result).toBeInstanceOf(ReferenceError);
      expect(result.message).toBe('Reference Issue: Variable not defined');
      expect(result).not.toBe(originalError);
    });

    it('should preserve error type for SyntaxError', () => {
      const originalError = new SyntaxError('Invalid syntax');
      const issue = 'Syntax Issue';

      const result = getMutatedError(originalError, issue);

      expect(result).toBeInstanceOf(SyntaxError);
      expect(result.message).toBe('Syntax Issue: Invalid syntax');
      expect(result).not.toBe(originalError);
    });

    it('should preserve stack trace when available', () => {
      const originalError = new Error('Original message');
      const originalStack = originalError.stack;
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue);

      expect(result.stack).toBe(originalStack);
      expect(result).not.toBe(originalError);
    });

    it('should preserve custom properties on error objects', () => {
      const originalError = new Error('Original message') as any;
      originalError.customProperty = 'custom value';
      originalError.errorCode = 123;
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue) as any;

      expect(result.customProperty).toBe('custom value');
      expect(result.errorCode).toBe(123);
      expect(result.message).toBe('Test Issue: Original message');
      expect(result).not.toBe(originalError);
    });

    it('should handle errors with non-writable properties gracefully', () => {
      const originalError = new Error('Original message');
      Object.defineProperty(originalError, 'nonWritable', {
        value: 'cannot change',
        writable: false,
        enumerable: true,
      });
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue);

      expect(result.message).toBe('Test Issue: Original message');
      expect(result).not.toBe(originalError);
      // Should not throw even if property copy fails
    });

    it('should handle stacktrace property (non-standard)', () => {
      const originalError = new Error('Original message') as any;
      originalError.stacktrace = 'custom stacktrace';
      delete originalError.stack;
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue) as any;

      expect(result.stacktrace).toBe('custom stacktrace');
      expect(result.message).toBe('Test Issue: Original message');
    });

    it('should handle opera#sourceloc property', () => {
      const originalError = new Error('Original message') as any;
      originalError['opera#sourceloc'] = 'opera location';
      delete originalError.stack;
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue) as any;

      expect(result['opera#sourceloc']).toBe('opera location');
      expect(result.message).toBe('Test Issue: Original message');
    });

    it('should fallback to generic Error when constructor fails', () => {
      const originalError = new Error('Original message');
      // Mock a constructor that throws
      originalError.constructor = (() => {
        throw new Error('Constructor failed');
      }) as any;
      const issue = 'Test Issue';

      const result = getMutatedError(originalError, issue);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Test Issue: {}');
    });

    it('should handle null and undefined inputs', () => {
      const nullResult = getMutatedError(null, 'Null Issue');
      const undefinedResult = getMutatedError(undefined, 'Undefined Issue');

      expect(nullResult).toBeInstanceOf(Error);
      expect(nullResult.message).toBe('Null Issue: null');
      expect(undefinedResult).toBeInstanceOf(Error);
      expect(undefinedResult.message).toBe('Undefined Issue: undefined');
    });

    it('should handle circular references in non-Error objects', () => {
      const circular: any = { message: 'circular' };
      circular.self = circular;
      const issue = 'Circular Issue';

      const result = getMutatedError(circular, issue);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toContain('Circular Issue:');
      // Should not throw due to circular reference
    });
  });
});
