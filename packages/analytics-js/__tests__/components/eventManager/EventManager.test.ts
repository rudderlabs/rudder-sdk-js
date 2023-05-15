import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { EventManager } from '@rudderstack/analytics-js/components/eventManager/EventManager';
import { defaultEventRepository } from '@rudderstack/analytics-js/components/eventRepository/EventRepository';

describe('EventManager', () => {
  class MockErrorHandler implements IErrorHandler {
    onError = jest.fn();
    leaveBreadcrumb = jest.fn();
    notifyError = jest.fn();
  }

  const mockErrorHandler = new MockErrorHandler();
  const eventManager = new EventManager(defaultEventRepository, mockErrorHandler);

  it('should raise error if the event data is invalid', () => {
    eventManager.addEvent({
      // @ts-ignore
      type: 'test',
      event: 'test',
      properties: {
        test: 'test',
      },
    });

    expect(mockErrorHandler.onError).toBeCalledWith(
      'Unable to generate RudderStack event object',
      'Event Manager',
      undefined,
      undefined,
    );
  });

  it('should throw an exception if the event data is invalid and error handler is not defined', () => {
    const eventManager = new EventManager();
    expect(() => {
      eventManager.addEvent({
        // @ts-ignore
        type: 'test',
        event: 'test',
        properties: {
          test: 'test',
        },
      });
    }).toThrowError('Unable to generate RudderStack event object');
  });
});
