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
    });
  };

  const originalUserAgent = (globalThis.navigator as any).userAgent;

  beforeEach(() => {
    jest.useFakeTimers();
    setVisibilityState('visible');
  });

  afterEach(() => {
    (globalThis.navigator as any).userAgent = originalUserAgent;
  });

  it('should fire the callback on pagehide event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchDocumentEvent('pagehide');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(false);
  });

  it('should fire the callback on pagehide event based on visibility state', () => {
    setVisibilityState('hidden');
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchDocumentEvent('pagehide');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(true);
  });

  it('should fire the callback on beforeunload event for IE11', () => {
    (globalThis.navigator as any).userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchWindowEvent('beforeunload');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(false);
  });

  it('should fire the callback on visibilitychange event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    setVisibilityState('hidden');
    dispatchDocumentEvent('visibilitychange');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(true);
  });

  it('should not fire the callback on visibilitychange event if visibilityState is visible', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    setVisibilityState('visible');
    dispatchDocumentEvent('visibilitychange');
    expect(evCallback).not.toHaveBeenCalled();
  });

  it('should fire the callback on blur event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchWindowEvent('blur');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(true);
  });

  it('should not fire the callback on focus event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchWindowEvent('focus');
    expect(evCallback).not.toHaveBeenCalled();
  });

  it('should not fire the callback twice on pagehide event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchDocumentEvent('pagehide');
    dispatchDocumentEvent('pagehide');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(false);
  });

  it('should not fire the callback twice on beforeunload event for IE11', () => {
    (globalThis.navigator as any).userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchWindowEvent('beforeunload');
    dispatchWindowEvent('beforeunload');
    expect(evCallback).toHaveBeenCalledTimes(1);
    expect(evCallback).toHaveBeenCalledWith(false);
  });

  it('should fire the callback only once if even multiple events are fired', () => {
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

  it('should fire the callback reliably when visibility changes multiple times', () => {
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

  it('should fire the callback reliably when blur and focus events are fired multiple times', () => {
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

  it('should fire the callback on pagehide event even after multiple visibility changes happen', () => {
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

  it('should fire the callback on beforeunload event even after multiple visibility changes happen for IE11', () => {
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

  it('should fire the callback on beforeunload event on the next tick even when the tab is inactive for IE11', () => {
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
