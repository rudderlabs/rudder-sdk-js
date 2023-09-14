import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { EventManager } from '../../../src/components/eventManager/EventManager';
import { EventRepository } from '../../../src/components/eventRepository/EventRepository';
import { UserSessionManager } from '../../../src/components/userSessionManager/UserSessionManager';
import { PluginEngine } from '../../../src/services/PluginEngine/PluginEngine';
import { PluginsManager } from '../../../src/components/pluginsManager/PluginsManager';

describe('EventManager', () => {
  class MockErrorHandler implements IErrorHandler {
    onError = jest.fn();
    leaveBreadcrumb = jest.fn();
    notifyError = jest.fn();
  }

  const mockErrorHandler = new MockErrorHandler();
  const pluginEngine = new PluginEngine();
  const pluginsManager = new PluginsManager(pluginEngine, mockErrorHandler);
  const eventRepository = new EventRepository(pluginsManager, mockErrorHandler);
  const userSessionManager = new UserSessionManager();
  const eventManager = new EventManager(eventRepository, userSessionManager, mockErrorHandler);

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
      new Error('Failed to generate the event object.'),
      'EventManager',
      undefined,
      undefined,
    );
  });

  it('should throw an exception if the event data is invalid and error handler is not defined', () => {
    const eventManager = new EventManager(eventRepository, userSessionManager);
    expect(() => {
      eventManager.addEvent({
        // @ts-ignore
        type: 'test',
        event: 'test',
        properties: {
          test: 'test',
        },
      });
    }).toThrowError('Failed to generate the event object.');
  });
});
