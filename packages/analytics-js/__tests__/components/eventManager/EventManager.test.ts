import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { EventManager } from '@rudderstack/analytics-js/components/eventManager/EventManager';

describe('EventManager', () => {
  class MockErrorHandler implements IErrorHandler {
    onError = jest.fn();
  }

  const mockErrorHandler = new MockErrorHandler();
  const eventManager = new EventManager(mockErrorHandler);

  it('should raise error if the event data is invalid', () => {
    eventManager.addEvent({
      type: 'test',
      event: 'test',
      properties: {
        test: 'test',
      },
    });

    expect(mockErrorHandler.onError).toBeCalledWith(
      'Unable to generate RudderStack event object',
      'EventManager',
    );
  });

  it('should throw an exception if the event data is invalid and error handler is not defined', () => {
    const eventManager = new EventManager();
    expect(() => {
      eventManager.addEvent({
        type: 'test',
        event: 'test',
        properties: {
          test: 'test',
        },
      });
    }).toThrowError('Unable to generate RudderStack event object');
  });
});
