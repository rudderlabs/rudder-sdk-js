import {
  updateTopLevelEventElements,
  checkForReservedElementsInObject,
  checkForReservedElements,
  getContextPageProperties,
  getMergedContext,
  processOptions,
} from '@rudderstack/analytics-js/plugins/eventProcessor/utilities';
import { state } from '@rudderstack/analytics-js/state';
import { batch } from '@preact/signals-core';
import {
  RudderEvent,
  RudderContext,
} from '@rudderstack/analytics-js/components/eventManager/types';
import * as R from 'ramda';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';

jest.mock('@rudderstack/analytics-js/components/utilities/timestamp', () => ({
  getCurrentTimeFormatted: jest.fn().mockReturnValue('2020-01-01T00:00:00.000Z'),
}));

jest.mock('@rudderstack/analytics-js/components/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

const defaultAnonId = 'default-anon-id';
const defaultIntegrations = { All: false, 'Default Integration': true };
const defaultOriginalTimestamp = 'default-timestamp';

const sampleAnonId = 'sample-anon-id';
const sampleIntegrations = { All: true, 'Sample Integration': true };
const sampleOriginalTimestamp = 'sample-timestamp';

// @ts-ignore
const defaultContext = {
  library: {
    name: 'test',
    version: '1.0',
  },
  locale: 'en-US',
  app: {
    name: 'test',
    version: '1.0',
  },
  campaign: {
    name: 'test',
    source: 'test',
  },
} as RudderContext;

describe('eventProcessor utilities', () => {
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
      const apiOptions = {
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

  describe('checkForReservedElementsInObject', () => {
    const defaultParentKeyPath = 'traits';

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
        EVENT: 'test event',
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

  describe('checkForReservedElements', () => {
    it('should log a warn message if the event (properties, traits, and context traits) contains reserved elements', () => {
      // @ts-ignore
      const rudderEvent = {
        type: defaultEventType,
        properties: {
          anonymous_id: sampleAnonId,
          original_timestamp: sampleOriginalTimestamp,
        },
        traits: {
          original_timestamp: sampleOriginalTimestamp,
          event: 'test event',
        },
        // @ts-ignore
        context: {
          traits: {
            anonymous_id: sampleAnonId,
          },
          locale: 'en-US',
        } as RudderContext,
      } as RudderEvent;

      checkForReservedElements(rudderEvent, mockLogger);

      expect(mockLogger.warn.mock.calls[0][0]).toEqual(
        `Reserved keyword used in properties --> "anonymous_id" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[1][0]).toEqual(
        `Reserved keyword used in properties --> "original_timestamp" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[2][0]).toEqual(
        `Reserved keyword used in traits --> "original_timestamp" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[3][0]).toEqual(
        `Reserved keyword used in traits --> "event" for ${rudderEvent.type} event`,
      );
      expect(mockLogger.warn.mock.calls[4][0]).toEqual(
        `Reserved keyword used in context.traits --> "anonymous_id" for ${rudderEvent.type} event`,
      );
    });
  });

  describe('processOptions', () => {
    // @ts-ignore
    const rudderEvent: RudderEvent = {
      event: 'test_event',
      properties: {
        someKey: 'someValue',
      },
      anonymousId: defaultAnonId,
      originalTimestamp: defaultOriginalTimestamp,
      context: defaultContext,
    } as RudderEvent;

    it('should update event context with data from options', () => {
      // Set specific contextual data in options to override
      // Both top-level elements and context elements should be updated
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        anonymousId: 'test_anon_id',
        app: {
          name: 'test1',
          isNew: true,
        },
        context: {
          campaign: {
            name: 'test1',
            isNew: true,
          },
          locale: 'en-UK',
        },
      };

      processOptions(rudderEvent, apiOptions);

      expect(rudderEvent).toEqual({
        event: 'test_event',
        properties: {
          someKey: 'someValue',
        },
        anonymousId: 'test_anon_id',
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        context: {
          library: {
            name: 'test',
            version: '1.0',
          },
          locale: 'en-UK',
          app: {
            name: 'test1',
            version: '1.0',
            isNew: true,
          },
          campaign: {
            name: 'test1',
            isNew: true,
            source: 'test',
          },
          newContextKey1: 'newContextValue1',
        },
      });
    });

    it('should not update event if options is not a valid object', () => {
      // @ts-ignore
      processOptions(rudderEvent, 'test');

      expect(rudderEvent).toEqual(rudderEvent);
    });

    it('should not update event if options is null', () => {
      processOptions(rudderEvent, null);

      expect(rudderEvent).toEqual(rudderEvent);
    });

    it('should not update event if options is undefined', () => {
      processOptions(rudderEvent, undefined);

      expect(rudderEvent).toEqual(rudderEvent);
    });
  });

  describe('getContextPageProperties', () => {
    let pageProperties: ApiObject;
    beforeEach(() => {
      pageProperties = {
        path: '/test',
        referrer: 'https://www.google.com/test',
        search: '?test=true',
        title: 'test page',
        url: 'https://www.rudderlabs.com/test',
        referring_domain: 'www.google.com',
        tab_url: 'https://www.rudderlabs.com/test1',
        initial_referrer: 'https://www.google.com/test1',
        initial_referring_domain: 'www.google.com',
        anonymous_id: defaultAnonId,
      } as ApiObject;
    });

    it('should return input page properties if input page properties are valid', () => {
      const contextPageProperties = getContextPageProperties(pageProperties);

      expect(contextPageProperties).toEqual({
        path: pageProperties.path,
        referrer: pageProperties.referrer,
        search: pageProperties.search,
        title: pageProperties.title,
        url: pageProperties.url,
        referring_domain: pageProperties.referring_domain,
        tab_url: pageProperties.tab_url,
        initial_referrer: pageProperties.initial_referrer,
        initial_referring_domain: pageProperties.initial_referring_domain,
      });
    });

    it('should return page properties from state if some input page parameters are not defined', () => {
      // Set some specific page properties in state
      batch(() => {
        state.page.path.value = 'https://www.google.com/test3.html';
        state.page.search.value = '?asdf=1234';
      });

      // Reset the input page properties
      pageProperties.path = undefined;
      pageProperties.search = undefined;

      const updatedPageProperties = getContextPageProperties(pageProperties);

      expect(updatedPageProperties).toEqual({
        path: state.page.path.value,
        referrer: pageProperties.referrer,
        search: state.page.search.value,
        title: pageProperties.title,
        url: pageProperties.url,
        referring_domain: pageProperties.referring_domain,
        tab_url: pageProperties.tab_url,
        initial_referrer: pageProperties.initial_referrer,
        initial_referring_domain: pageProperties.initial_referring_domain,
      });
    });
  });

  describe('getMergedContext', () => {
    it('should return context with data merged from options', () => {
      // Set specific contextual data in options to override
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        app: {
          name: 'test1',
          isNew: true,
        },
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test1',
          isNew: true,
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
      });
    });

    it('should return context with data the context object merged from options', () => {
      // Set specific contextual data in options to override
      // Moreover, directly specify the 'context' object itself
      const apiOptions = {
        newContextKey1: {
          someKey: 'someValue',
        },
        context: {
          campaign: {
            name: 'test1',
            isNew: true,
          },
          locale: 'en-UK',
          app: {
            name: 'test3',
            version: '2.0',
          },
        },
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-UK',
        app: {
          name: 'test3',
          version: '2.0',
        },
        campaign: {
          name: 'test1',
          isNew: true,
          source: 'test',
        },
        newContextKey1: {
          someKey: 'someValue',
        },
      });
    });

    it('should skip merging into context if options contain either top-level or context reserved elements', () => {
      // Set specific contextual data in options to override
      // Include top-level elements and reserved elements in options and options context object
      // which should be skipped
      const apiOptions: ApiOptions = {
        newContextKey1: 'newContextValue1',
        anonymousId: 'test_anon_id',
        originalTimestamp: '2020-01-01T00:00:00.000Z',
        library: {
          name: 'test1',
          isNew: true,
        },
        context: {
          campaign: {
            name: 'test1',
            isNew: true,
          },
          locale: 'en-UK',
          consentManagement: {
            deniedConsentIds: ['id1', 'id2'],
          },
        },
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        newContextKey1: 'newContextValue1',
        locale: 'en-UK',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test1',
          isNew: true,
          source: 'test',
        },
      });
    });

    it('should log warning if the context inside the options is not a valid object', () => {
      // Set specific contextual data in options to override
      // Set the 'context' object to be a string
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        newContextKey2: 'newContextValue2',
        context: 'test',
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions, mockLogger);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
        newContextKey2: 'newContextValue2',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'The "context" element passed in the options is not a valid object',
      );
    });

    it('should log warning if the context inside the options is null', () => {
      // Set specific contextual data in options to override
      // Set the 'context' object to be a null
      const apiOptions: ApiOptions = {
        newContextKey1: 'newContextValue1',
        context: null,
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions, mockLogger);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'The "context" element passed in the options is not a valid object',
      );
    });

    it('should log warning if the context inside the options is undefined', () => {
      // Set specific contextual data in options to override
      // Set the 'context' object to be undefined
      const apiOptions = {
        newContextKey1: 'newContextValue1',
        context: undefined,
      };

      const mergedContext = getMergedContext(defaultContext, apiOptions, mockLogger);

      expect(mergedContext).toEqual({
        library: {
          name: 'test',
          version: '1.0',
        },
        locale: 'en-US',
        app: {
          name: 'test',
          version: '1.0',
        },
        campaign: {
          name: 'test',
          source: 'test',
        },
        newContextKey1: 'newContextValue1',
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'The "context" element passed in the options is not a valid object',
      );
    });
  });
});
