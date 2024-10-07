import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { EventManager } from '../../../src/components/eventManager/EventManager';
import { EventRepository } from '../../../src/components/eventRepository/EventRepository';
import { UserSessionManager } from '../../../src/components/userSessionManager/UserSessionManager';
import { PluginEngine } from '../../../src/services/PluginEngine/PluginEngine';
import { StoreManager } from '../../../src/services/StoreManager/StoreManager';
import { PluginsManager } from '../../../src/components/pluginsManager/PluginsManager';
import { defaultLogger } from '../../../__mocks__/Logger';
import { HttpClient } from '../../../src/services/HttpClient';

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
  const defaultHttpClient = new HttpClient(defaultLogger);
  const eventRepository = new EventRepository(
    defaultHttpClient,
    pluginsManager,
    storeManager,
    mockErrorHandler,
  );
  const userSessionManager = new UserSessionManager();
  const eventManager = new EventManager(eventRepository, userSessionManager, mockErrorHandler);

  describe('init', () => {
    it('should initialize on init', () => {
      const eventRepositoryInitSpy = jest.spyOn(eventRepository, 'init');
      eventManager.init();
      expect(eventRepositoryInitSpy).toHaveBeenCalled();

      eventRepositoryInitSpy.mockRestore();
    });
  });

  describe('addEvent', () => {
    it('should raise error if the event data is invalid', () => {
      eventManager.addEvent({
        // @ts-expect-error Testing invalid event data
        type: 'test',
        event: 'test',
        properties: {
          test: 'test',
        },
      });

      expect(mockErrorHandler.onError).toHaveBeenCalledWith(
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
          // @ts-expect-error Testing invalid event data
          type: 'test',
          event: 'test',
          properties: {
            test: 'test',
          },
        });
      }).toThrow('Failed to generate the event object.');
    });
  });

  describe('resume', () => {
    it('should resume on resume', () => {
      const eventRepositoryResumeSpy = jest.spyOn(eventRepository, 'resume');
      eventManager.resume();
      expect(eventRepositoryResumeSpy).toHaveBeenCalled();

      eventRepositoryResumeSpy.mockRestore();
    });
  });
});
