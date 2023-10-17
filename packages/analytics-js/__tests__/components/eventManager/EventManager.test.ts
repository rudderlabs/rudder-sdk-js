import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { EventManager } from '@rudderstack/analytics-js/components/eventManager/EventManager';
import { EventRepository } from '@rudderstack/analytics-js/components/eventRepository/EventRepository';
import { UserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/UserSessionManager';
import { PluginEngine } from '@rudderstack/analytics-js/services/PluginEngine/PluginEngine';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager/StoreManager';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/PluginsManager';

describe('EventManager', () => {
  class MockErrorHandler implements IErrorHandler {
    onError = jest.fn();
    leaveBreadcrumb = jest.fn();
    notifyError = jest.fn();
    init = jest.fn();
  }

  const mockErrorHandler = new MockErrorHandler();
  const pluginEngine = new PluginEngine();
  const pluginsManager = new PluginsManager(pluginEngine, mockErrorHandler);
  const storeManager = new StoreManager(pluginsManager, mockErrorHandler);
  const eventRepository = new EventRepository(pluginsManager, storeManager, mockErrorHandler);
  const userSessionManager = new UserSessionManager();
  const eventManager = new EventManager(eventRepository, userSessionManager, mockErrorHandler);

  describe('init', () => {
    it('should initialize on init', () => {
      const eventRepositoryInitSpy = jest.spyOn(eventRepository, 'init');
      eventManager.init();
      expect(eventRepositoryInitSpy).toBeCalled();

      eventRepositoryInitSpy.mockRestore();
    });
  });

  describe('addEvent', () => {
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

  describe('resume', () => {
    it('should resume on resume', () => {
      const eventRepositoryResumeSpy = jest.spyOn(eventRepository, 'resume');
      eventManager.resume();
      expect(eventRepositoryResumeSpy).toBeCalled();

      eventRepositoryResumeSpy.mockRestore();
    });
  });
});
