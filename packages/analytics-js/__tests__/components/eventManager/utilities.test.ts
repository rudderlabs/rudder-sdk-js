import {
  updateTopLevelEventElements,
  checkForReservedElementsInObject,
} from '../../../src/components/eventManager/utilities';
import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import * as R from 'ramda';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';

const defaultAnonId = 'default-anon-id';
const defaultIntegrations = { All: false, 'Default Integration': true };
const defaultOriginalTimestamp = 'default-timestamp';

const sampleAnonId = 'sample-anon-id';
const sampleIntegrations = { All: true, 'Sample Integration': true };
const sampleOriginalTimestamp = 'sample-timestamp';

describe('Event Manager - Utilities', () => {
  describe('updateTopLevelEventElements', () => {
    const rudderEvent: RudderEvent = {} as RudderEvent;

    beforeEach(() => {
      rudderEvent.anonymousId = defaultAnonId;
      rudderEvent.integrations = R.clone(defaultIntegrations);
      rudderEvent.originalTimestamp = defaultOriginalTimestamp;
    });

    it('should update top level event elements from options', () => {
      const apiOptions: ApiOptions = {
        anonymousId: sampleAnonId,
        integrations: R.clone(sampleIntegrations),
        originalTimestamp: sampleOriginalTimestamp,
      };
      updateTopLevelEventElements(rudderEvent, apiOptions);
      expect(rudderEvent.anonymousId).toEqual(apiOptions.anonymousId);
      expect(rudderEvent.integrations).toEqual(apiOptions.integrations);
      expect(rudderEvent.originalTimestamp).toEqual(apiOptions.originalTimestamp);
    });

    it('should not update the top level event elements from options that are not valid', () => {
      const apiOptions: ApiOptions = {
        integrations: sampleIntegrations,
      };

      updateTopLevelEventElements(rudderEvent, apiOptions);
      expect(rudderEvent.anonymousId).toEqual(defaultAnonId);
      expect(rudderEvent.integrations).toEqual(apiOptions.integrations);
      expect(rudderEvent.originalTimestamp).toEqual(defaultOriginalTimestamp);
    });

    it('should not update the top level event elements from options that are not valid type', () => {
      // Intentionally use invalid types to test the type check
      // @ts-ignore
      const apiOptions: ApiOptions = {
        anonymousId: 123,
        integrations: 'sample-integrations',
        originalTimestamp: {},
      } as ApiOptions;

      updateTopLevelEventElements(rudderEvent, apiOptions);
      expect(rudderEvent.anonymousId).toEqual(defaultAnonId);
      expect(rudderEvent.integrations).toEqual(defaultIntegrations);
      expect(rudderEvent.originalTimestamp).toEqual(defaultOriginalTimestamp);
    });
  });

  describe('checkForReservedElementsInObject', () => {
    class MockLogger implements ILogger {
      warn = jest.fn();
      log = jest.fn();
      error = jest.fn();
      info = jest.fn();
      debug = jest.fn();
      minLogLevel = 0;
      scope = 'test scope';
      setMinLogLevel = jest.fn();
      setScope = jest.fn();
      logProvider = console;
    }
    const mockLogger = new MockLogger();

    const defaultEventType = 'test';
    const defaultParentKeyPath = 'traits';
    const defaultEvent = 'test event';

    it('should log a warn message if the object contains reserved elements', () => {
      const obj = {
        anonymous_id: sampleAnonId,
        original_timestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn.mock.calls[0][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "anonymous_id" for ${defaultEventType} event`,
      );
      expect(mockLogger.warn.mock.calls[1][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "original_timestamp" for ${defaultEventType} event`,
      );
    });

    it('should not log a warn message if the object does not contain reserved elements', () => {
      const obj = {
        nonReservedKey: 123,
        nonReservedKey2: 'sample',
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the logger is not provided', () => {
      const obj = {
        anonymous_id: sampleAnonId,
        original_timestamp: sampleOriginalTimestamp,
        nonReservedKey: 123,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn message if the object is not provided', () => {
      checkForReservedElementsInObject(
        undefined,
        defaultEventType,
        defaultParentKeyPath,
        mockLogger,
      );

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warn message if the object contains reserved elements but with different case', () => {
      const obj = {
        ANONYMOUS_ID: sampleAnonId,
        EVENT: defaultEvent,
        nonReservedKey: 123,
        original_timestamp: sampleOriginalTimestamp,
      } as ApiObject;

      checkForReservedElementsInObject(obj, defaultEventType, defaultParentKeyPath, mockLogger);

      expect(mockLogger.warn.mock.calls[0][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "ANONYMOUS_ID" for ${defaultEventType} event`,
      );
      expect(mockLogger.warn.mock.calls[1][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "EVENT" for ${defaultEventType} event`,
      );
      expect(mockLogger.warn.mock.calls[2][0]).toEqual(
        `Reserved keyword used in ${defaultParentKeyPath} --> "original_timestamp" for ${defaultEventType} event`,
      );
    });
  });
});
