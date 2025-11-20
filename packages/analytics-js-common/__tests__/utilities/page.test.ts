import { onPageLeave } from '../../src/utilities/page';

describe('onPageLeave', () => {
  const dispatchDocumentEvent = (event: 'pagehide' | 'visibilitychange') => {
    document.dispatchEvent(new Event(event));
  };

  const dispatchWindowEvent = (event: 'beforeunload' | 'blur' | 'focus') => {
    window.dispatchEvent(new Event(event));
  };

  const setVisibilityState = (state: DocumentVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', {
      value: state,
      writable: true,
      configurable: true,
    });
  };

  const originalUserAgent = (globalThis.navigator as any).userAgent;

  beforeEach(() => {
    jest.useFakeTimers();
    setVisibilityState('visible');
    jest.clearAllMocks();
  });

  afterEach(() => {
    (globalThis.navigator as any).userAgent = originalUserAgent;
    jest.useRealTimers();
  });

  describe('basic event handling', () => {
    it('should fire callback on pagehide event with visible state', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(false);
    });

    it('should fire callback on pagehide event with hidden state', () => {
      setVisibilityState('hidden');
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(true);
    });

    it('should fire callback on beforeunload event for IE11', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(false);
    });

    it('should fire callback on visibilitychange to hidden', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(true);
    });

    it('should not fire callback on visibilitychange to visible', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('visible');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).not.toHaveBeenCalled();
    });

    it('should fire callback on blur event', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(true);
    });

    it('should not fire callback on focus event', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('focus');
      expect(evCallback).not.toHaveBeenCalled();
    });
  });

  describe('deduplication behavior', () => {
    it('should fire callback only once when multiple events fire simultaneously', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchDocumentEvent('pagehide');
      dispatchWindowEvent('beforeunload');
      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(false);
    });

    it('should not fire callback twice on duplicate beforeunload events for IE11', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('beforeunload');
      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(false);
    });
  });

  describe('multiple event cycles', () => {
    it('should fire callback on each visibility change cycle', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');

      setVisibilityState('visible');
      dispatchDocumentEvent('visibilitychange');

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(2);

      expect(evCallback).toHaveBeenNthCalledWith(1, true);
      expect(evCallback).toHaveBeenNthCalledWith(2, true);
    });

    it('should fire callback on each blur/focus cycle', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      dispatchWindowEvent('focus');
      dispatchWindowEvent('blur');
      dispatchWindowEvent('focus');
      expect(evCallback).toHaveBeenCalledTimes(2);

      expect(evCallback).toHaveBeenNthCalledWith(1, true);
      expect(evCallback).toHaveBeenNthCalledWith(2, true);
    });

    it('should fire callback for pagehide after visibility change cycle', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');

      setVisibilityState('visible');
      dispatchDocumentEvent('visibilitychange');

      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(2);

      expect(evCallback).toHaveBeenNthCalledWith(1, true);
      expect(evCallback).toHaveBeenNthCalledWith(2, false);
    });

    it('should fire callback for beforeunload after visibility change cycle for IE11', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');

      setVisibilityState('visible');
      dispatchDocumentEvent('visibilitychange');

      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenCalledTimes(2);

      expect(evCallback).toHaveBeenNthCalledWith(1, true);
      expect(evCallback).toHaveBeenNthCalledWith(2, false);
    });

    it('should fire beforeunload on next tick after visibilitychange for IE11', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');

      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenNthCalledWith(1, true);

      jest.runAllTimers();

      dispatchWindowEvent('beforeunload');

      expect(evCallback).toHaveBeenCalledTimes(2);
      expect(evCallback).toHaveBeenNthCalledWith(2, false);
    });
  });

  describe('avoidBfCacheOptimization parameter', () => {
    it('should subscribe to beforeunload event on modern browsers when avoidBfCacheOptimization is true', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const evCallback = jest.fn();
      onPageLeave(evCallback, true);

      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(false);
    });

    it('should not subscribe to beforeunload event on modern browsers when avoidBfCacheOptimization is false', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const evCallback = jest.fn();
      onPageLeave(evCallback, false);

      dispatchWindowEvent('beforeunload');
      expect(evCallback).not.toHaveBeenCalled();
    });

    it('should subscribe to beforeunload event on IE11 regardless of avoidBfCacheOptimization value', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback, false);

      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(false);
    });
  });

  describe('isAccessible flag behavior', () => {
    it('should pass false for beforeunload events', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenCalledWith(false);
    });

    it('should pass true for visibilitychange to hidden', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledWith(true);
    });

    it('should pass true for blur events', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenCalledWith(true);
    });

    it('should pass false for pagehide with visible state', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('visible');
      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledWith(false);
    });

    it('should pass true for pagehide with hidden state', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledWith(true);
    });

    it('should maintain correct state across different event sequences', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      // blur → isAccessible = true
      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenLastCalledWith(true);

      // Reset and test beforeunload → isAccessible = false
      dispatchWindowEvent('focus');
      jest.clearAllMocks();

      dispatchWindowEvent('beforeunload');
      expect(evCallback).toHaveBeenLastCalledWith(false);

      // Reset and test visibilitychange → isAccessible = true
      jest.runAllTimers();
      jest.clearAllMocks();

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenLastCalledWith(true);
    });
  });

  describe('focus and blur integration', () => {
    it('should reset pageLeft flag on focus', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenCalledTimes(1);

      dispatchWindowEvent('focus');
      expect(evCallback).toHaveBeenCalledTimes(1);

      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenCalledTimes(2);
    });

    it('should handle iOS Safari tab close scenario', () => {
      (globalThis.navigator as any).userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1';
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenCalledWith(true);
    });
  });

  describe('pageLeft flag reset with setTimeout', () => {
    it('should allow callback to fire again after setTimeout completes', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(1);

      // pageLeft should still be true, preventing duplicate calls
      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(1);

      // After timer runs, pageLeft should reset
      jest.runAllTimers();

      // Now callback should fire again
      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(2);
    });

    it('should enable callback for inactive tab close scenario', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(1);

      // Advance timers to reset pageLeft flag
      jest.runAllTimers();

      // Simulate another listener being triggered (e.g., pagehide)
      dispatchDocumentEvent('pagehide');
      expect(evCallback).toHaveBeenCalledTimes(2);
    });

    it('should not fire callback multiple times before setTimeout completes', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      dispatchDocumentEvent('pagehide');
      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');

      expect(evCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle visibility changes during blur state', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      dispatchWindowEvent('blur');
      expect(evCallback).toHaveBeenCalledTimes(1);
      expect(evCallback).toHaveBeenLastCalledWith(true);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      // Should not fire again due to pageLeft flag
      expect(evCallback).toHaveBeenCalledTimes(1);
    });

    it('should correctly reset on visibilitychange to visible', () => {
      const evCallback = jest.fn();
      onPageLeave(evCallback);

      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(1);

      // Return to visible should reset pageLeft
      setVisibilityState('visible');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(1);

      // Should be able to fire again
      setVisibilityState('hidden');
      dispatchDocumentEvent('visibilitychange');
      expect(evCallback).toHaveBeenCalledTimes(2);
    });
  });
});
