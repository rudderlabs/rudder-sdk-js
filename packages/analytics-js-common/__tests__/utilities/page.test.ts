import { onPageLeave } from '../../src/utilities/page';

describe('onPageLeave', () => {
  const dispatchDocumentEvent = (event: 'pagehide' | 'visibilitychange') => {
    document.dispatchEvent(new Event(event));
  };

  const dispatchWindowEvent = (event: 'beforeunload') => {
    window.dispatchEvent(new Event(event));
  };

  const setVisibilityState = (state: DocumentVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', {
      value: state,
      writable: true,
    });
  };

  beforeEach(() => {
    setVisibilityState('visible');
  });

  it('should fire the callback on pagehide event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchDocumentEvent('pagehide');
    expect(evCallback).toHaveBeenCalledTimes(1);
  });

  it('should fire the callback on beforeunload event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchWindowEvent('beforeunload');
    expect(evCallback).toHaveBeenCalledTimes(1);
  });

  it('should fire the callback on visibilitychange event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    setVisibilityState('hidden');
    dispatchDocumentEvent('visibilitychange');
    expect(evCallback).toHaveBeenCalledTimes(1);
  });

  it('should not fire the callback on visibilitychange event if visibilityState is visible', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    setVisibilityState('visible');
    dispatchDocumentEvent('visibilitychange');
    expect(evCallback).not.toHaveBeenCalled();
  });

  it('should not fire the callback twice on pagehide event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchDocumentEvent('pagehide');
    dispatchDocumentEvent('pagehide');
    expect(evCallback).toHaveBeenCalledTimes(1);
  });

  it('should not fire the callback twice on beforeunload event', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchWindowEvent('beforeunload');
    dispatchWindowEvent('beforeunload');
    expect(evCallback).toHaveBeenCalledTimes(1);
  });

  it('should fire the callback only once if even multiple events are fired', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    dispatchDocumentEvent('pagehide');
    dispatchWindowEvent('beforeunload');
    setVisibilityState('hidden');
    dispatchDocumentEvent('visibilitychange');
    expect(evCallback).toHaveBeenCalledTimes(1);
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
  });

  it('should fire the callback on beforeunload event even after multiple visibility changes happen', () => {
    const evCallback = jest.fn();
    onPageLeave(evCallback);

    setVisibilityState('hidden');
    dispatchDocumentEvent('visibilitychange');

    setVisibilityState('visible');
    dispatchDocumentEvent('visibilitychange');

    dispatchWindowEvent('beforeunload');
    expect(evCallback).toHaveBeenCalledTimes(2);
  });
});
