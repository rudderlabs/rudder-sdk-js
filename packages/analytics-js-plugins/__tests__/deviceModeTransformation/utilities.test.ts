import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import {
  createPayload,
  sendTransformedEventToDestinations,
} from '../../src/deviceModeTransformation/utilities';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

describe('Device Mode Transformation Utilities', () => {
  let mockState: ApplicationState;
  let mockPluginsManager: IPluginsManager;
  let mockErrorHandler: IErrorHandler;
  let mockLogger: ILogger;

  const sampleEvent = {
    type: 'track',
    event: 'Test Event',
    userId: 'user123',
    anonymousId: 'anon123',
    properties: { test: 'value' },
    timestamp: '2023-01-01T00:00:00Z',
    messageId: 'message123',
    integrations: {},
    channel: 'web',
    context: {
      app: { name: 'test-app', version: '1.0.0', namespace: 'test', installType: 'cdn' },
      library: { name: 'rudder-js-sdk', version: '3.0.0' },
      page: { url: 'https://test.com' },
      userAgent: 'test-agent',
      ip: '127.0.0.1',
      locale: 'en-US',
      screen: { width: 1920, height: 1080, density: 1, innerWidth: 1920, innerHeight: 1080 },
      timezone: 'America/New_York',
      os: { name: 'unknown', version: '1.0' },
    },
    originalTimestamp: '2023-01-01T00:00:00Z',
  } as RudderEvent;

  const mockDestinations: Destination[] = [
    {
      id: 'dest1',
      displayName: 'GA4',
      userFriendlyId: 'GA4___dest1',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key1',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
    {
      id: 'dest2',
      displayName: 'Amplitude',
      userFriendlyId: 'Amplitude___dest2',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: true,
      config: {
        apiKey: 'key2',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
  ];

  beforeEach(() => {
    resetState();
    mockState = state;
    mockState.nativeDestinations.initializedDestinations.value = [...mockDestinations];

    mockPluginsManager = {
      invokeSingle: jest.fn(),
    } as any;

    mockErrorHandler = defaultErrorHandler;
    mockLogger = defaultLogger;

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createPayload', () => {
    it('should create transformation request payload with correct structure', () => {
      const destinationIds = ['dest1', 'dest2'];
      const token = 'test-token';

      const payload = createPayload(sampleEvent, destinationIds, token);

      expect(payload).toEqual({
        metadata: {
          'Custom-Authorization': token,
        },
        batch: [
          {
            orderNo: expect.any(Number),
            destinationIds,
            event: sampleEvent,
          },
        ],
      });
    });

    it('should create payload with null token', () => {
      const destinationIds = ['dest1'];
      const token = null;

      const payload = createPayload(sampleEvent, destinationIds, token);

      expect(payload.metadata['Custom-Authorization']).toBeNull();
    });

    it('should generate unique orderNo based on timestamp', () => {
      const destinationIds = ['dest1'];
      const token = 'test-token';

      const payload1 = createPayload(sampleEvent, destinationIds, token);
      const payload2 = createPayload(sampleEvent, destinationIds, token);

      expect(payload1.batch[0]?.orderNo).toBeGreaterThan(0);
      expect(payload2.batch[0]?.orderNo).toBeGreaterThanOrEqual(payload1.batch[0]?.orderNo || 0);
    });
  });

  describe('sendTransformedEventToDestinations', () => {
    beforeEach(() => {
      mockPluginsManager.invokeSingle = jest.fn();
    });

    it('should handle successful transformation (status 200)', () => {
      const destinationIds = ['dest1'];
      const transformationResponse = {
        transformedBatch: [
          {
            id: 'dest1',
            payload: [
              {
                status: '200',
                event: { ...sampleEvent, transformed: true },
              },
            ],
          },
        ],
      };
      const result = JSON.stringify(transformationResponse);
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'destinationsEventsQueue.enqueueEventToDestination',
        mockState,
        { ...sampleEvent, transformed: true },
        mockDestinations[0],
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle transformation failure with propagateEventsUntransformedOnError=true', () => {
      const destinationIds = ['dest2'];
      const transformationResponse = {
        transformedBatch: [
          {
            id: 'dest2',
            payload: [
              {
                status: '410',
                event: null,
              },
            ],
          },
        ],
      };
      const result = JSON.stringify(transformationResponse);
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Transformation is not available'),
      );
      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'destinationsEventsQueue.enqueueEventToDestination',
        mockState,
        sampleEvent,
        mockDestinations[1],
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle transformation failure with propagateEventsUntransformedOnError=false', () => {
      const destinationIds = ['dest1'];
      const transformationResponse = {
        transformedBatch: [
          {
            id: 'dest1',
            payload: [
              {
                status: '410',
                event: null,
              },
            ],
          },
        ],
      };
      const result = JSON.stringify(transformationResponse);
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Transformation is not available'),
      );
      expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalled();
    });

    it('should handle server access denied (status 404)', () => {
      const destinationIds = ['dest1'];
      const result = 'Not Found';
      const status = 404;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'DeviceModeTransformationPlugin:: Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.',
      );
      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'destinationsEventsQueue.enqueueEventToDestination',
        mockState,
        sampleEvent,
        mockDestinations[0],
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle other error statuses with propagateEventsUntransformedOnError=true', () => {
      const destinationIds = ['dest2'];
      const result = 'Internal Server Error';
      const status = 500;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Sending untransformed event'),
      );
      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'destinationsEventsQueue.enqueueEventToDestination',
        mockState,
        sampleEvent,
        mockDestinations[1],
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle other error statuses with propagateEventsUntransformedOnError=false', () => {
      const destinationIds = ['dest1'];
      const result = 'Internal Server Error';
      const status = 500;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Dropping the event'));
      expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalled();
    });

    it('should handle exceptions during processing', () => {
      const destinationIds = ['dest1'];
      const result = 'invalid json';
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'DeviceModeTransformationPlugin',
        customMessage: expect.stringContaining('GA4'),
      });
    });

    it('should handle multiple destinations', () => {
      const destinationIds = ['dest1', 'dest2'];
      const transformationResponse = {
        transformedBatch: [
          {
            id: 'dest1',
            payload: [
              {
                status: '200',
                event: { ...sampleEvent, transformed: true },
              },
            ],
          },
          {
            id: 'dest2',
            payload: [
              {
                status: '200',
                event: { ...sampleEvent, transformed: true },
              },
            ],
          },
        ],
      };
      const result = JSON.stringify(transformationResponse);
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(2);
    });

    it('should skip empty events', () => {
      const destinationIds = ['dest1'];
      const transformationResponse = {
        transformedBatch: [
          {
            id: 'dest1',
            payload: [
              {
                status: '200',
                event: null,
              },
            ],
          },
        ],
      };
      const result = JSON.stringify(transformationResponse);
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalled();
    });

    it('should handle missing destination in state', () => {
      const destinationIds = ['nonexistent'];
      const transformationResponse = {
        transformedBatch: [
          {
            id: 'nonexistent',
            payload: [
              {
                status: '200',
                event: { ...sampleEvent, transformed: true },
              },
            ],
          },
        ],
      };
      const result = JSON.stringify(transformationResponse);
      const status = 200;

      sendTransformedEventToDestinations(
        mockState,
        mockPluginsManager,
        destinationIds,
        result,
        status,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalled();
    });
  });
});
