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
  logOncePerDestination,
  getDestinationId,
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

    describe('Cloned destinations support', () => {
      beforeEach(() => {
        // Setup state with cloned destinations
        const clonedDestinations: Destination[] = [
          {
            id: 'dest3_1',
            originalId: 'dest3',
            displayName: 'GA4',
            userFriendlyId: 'GA4___dest3_1',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'cloneA_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
          {
            id: 'dest3_2',
            originalId: 'dest3',
            displayName: 'GA4',
            userFriendlyId: 'GA4___dest3_2',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: true,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'cloneB_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
          {
            id: 'dest4_1',
            originalId: 'dest4',
            displayName: 'Amplitude',
            userFriendlyId: 'Amplitude___dest4_1',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'clone_amplitude_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
        ];

        mockState.nativeDestinations.initializedDestinations.value = [
          ...mockDestinations,
          ...clonedDestinations,
        ];
      });

      it('should send events to multiple cloned destinations with same originalId', () => {
        const destinationIds = ['dest3']; // Using originalId for transformation request
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest3', // Response uses originalId
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

        // Should invoke both cloned destinations
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(2);

        // Check both clones were called
        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        expect(calls[0]?.[3]?.id).toBe('dest3_1');
        expect(calls[1]?.[3]?.id).toBe('dest3_2');

        // Both should receive the transformed event
        expect(calls[0]?.[2]).toEqual({ ...sampleEvent, transformed: true });
        expect(calls[1]?.[2]).toEqual({ ...sampleEvent, transformed: true });
      });

      it('should handle transformation failure for cloned destinations with different propagation settings', () => {
        const destinationIds = ['dest3']; // Using originalId
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest3',
              payload: [
                {
                  status: '410', // Transformation not available
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

        // Should be called once for the clone with propagateEventsUntransformedOnError=true
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(1);

        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        expect(calls[0]?.[3]?.id).toBe('dest3_2'); // The one with propagateEventsUntransformedOnError=true
        expect(calls[0]?.[2]).toEqual(sampleEvent); // Original untransformed event
      });

      it('should handle mixed original and cloned destinations', () => {
        const destinationIds = ['dest1', 'dest3']; // Mix of original and cloned
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest1',
              payload: [
                {
                  status: '200',
                  event: { ...sampleEvent, transformed: true, dest: 'dest1' },
                },
              ],
            },
            {
              id: 'dest3',
              payload: [
                {
                  status: '200',
                  event: { ...sampleEvent, transformed: true, dest: 'dest3' },
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

        // Should invoke original dest1 + both cloned dest3 destinations = 3 total
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(3);

        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        const calledDestIds = calls.map(call => call[3]?.id);

        expect(calledDestIds).toContain('dest1');
        expect(calledDestIds).toContain('dest3_1');
        expect(calledDestIds).toContain('dest3_2');
      });

      it('should use originalId for destination filtering and identification', () => {
        // Test that destinations are found by originalId when provided in destinationIds
        const destinationIds = ['dest3', 'dest4'];
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest3',
              payload: [
                {
                  status: '200',
                  event: { ...sampleEvent, transformed: true },
                },
              ],
            },
            {
              id: 'dest4',
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

        // Should invoke 2 dest3 clones + 1 dest4 clone = 3 total
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(3);

        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        const calledDestIds = calls.map(call => call[3]?.id);

        expect(calledDestIds).toContain('dest3_1');
        expect(calledDestIds).toContain('dest3_2');
        expect(calledDestIds).toContain('dest4_1');
      });

      it('should handle cloned destinations with different error behaviors on server errors', () => {
        const destinationIds = ['dest3'];
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

        // Only the clone with propagateEventsUntransformedOnError=true should receive the event
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(1);

        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        expect(calls[0]?.[3]?.id).toBe('dest3_2'); // The one with propagateEventsUntransformedOnError=true
        expect(calls[0]?.[2]).toEqual(sampleEvent); // Original untransformed event
      });

      it('should handle cloned destinations when original destination does not exist in state', () => {
        // Remove original destinations but keep cloned ones
        mockState.nativeDestinations.initializedDestinations.value = [
          {
            id: 'dest5_1',
            originalId: 'dest5',
            displayName: 'Nonexistent Original Clone',
            userFriendlyId: 'TestDestination___dest5_1',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'clone_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
        ];

        const destinationIds = ['dest5'];
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest5',
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

        // Should still work with just the cloned destination
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(1);

        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        expect(calls[0]?.[3]?.id).toBe('dest5_1');
        expect(calls[0]?.[2]).toEqual({ ...sampleEvent, transformed: true });
      });
    });

    describe('Log deduplication behavior', () => {
      beforeEach(() => {
        // Setup destinations with multiple clones having same originalId
        const destinationsWithClones: Destination[] = [
          {
            id: 'dest6_1',
            originalId: 'dest6',
            displayName: 'TestDestination',
            userFriendlyId: 'TestDestination___dest6_1',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'clone1_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
          {
            id: 'dest6_2',
            originalId: 'dest6',
            displayName: 'TestDestination',
            userFriendlyId: 'TestDestination___dest6_2',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'clone2_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
          {
            id: 'dest6_3',
            originalId: 'dest6',
            displayName: 'TestDestination',
            userFriendlyId: 'TestDestination___dest6_3',
            enabled: true,
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            cloned: true,
            overridden: true,
            config: {
              apiKey: 'clone3_key',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
        ];

        mockState.nativeDestinations.initializedDestinations.value = destinationsWithClones;
      });

      it('should log error only once when multiple cloned destinations have transformation failures', () => {
        const destinationIds = ['dest6'];
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest6',
              payload: [
                {
                  status: '410', // Transformation not available
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

        // Should log error only once even though there are 3 cloned destinations
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Transformation is not available'),
        );

        // No events should be sent as propagateEventsUntransformedOnError=false for all
        expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalled();
      });

      it('should log warning only once when multiple cloned destinations have server errors', () => {
        const destinationIds = ['dest6'];
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

        // Should log warning only once despite 3 cloned destinations
        expect(mockLogger.warn).toHaveBeenCalledTimes(1);
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'DeviceModeTransformationPlugin:: Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.',
        );

        // All 3 cloned destinations should receive the untransformed event
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(3);
      });

      it('should log error only once when multiple cloned destinations have general server errors', () => {
        const destinationIds = ['dest6'];
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

        // Should log error only once despite 3 cloned destinations
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Dropping the event'),
        );

        // No events should be sent as propagateEventsUntransformedOnError=false for all
        expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalled();
      });

      it('should handle mixed cloned destinations with different propagation settings correctly', () => {
        // Modify one destination to have propagateEventsUntransformedOnError=true
        const modifiedDestinations = mockState.nativeDestinations.initializedDestinations.value.map(
          (dest, index) => ({
            ...dest,
            propagateEventsUntransformedOnError: index === 1, // Only second destination propagates
          }),
        );
        mockState.nativeDestinations.initializedDestinations.value = modifiedDestinations;

        const destinationIds = ['dest6'];
        const transformationResponse = {
          transformedBatch: [
            {
              id: 'dest6',
              payload: [
                {
                  status: '410', // Transformation not available
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

        // Since logOncePerDestination uses the destinationId (originalId) to dedupe,
        // and all clones have the same originalId, only one type of log should be called
        // depending on the first destination that's processed
        const totalLogs =
          (mockLogger.warn as jest.Mock).mock.calls.length +
          (mockLogger.error as jest.Mock).mock.calls.length;
        expect(totalLogs).toBe(1);

        // Only the destination with propagateEventsUntransformedOnError=true should receive event
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(1);

        const calls = (mockPluginsManager.invokeSingle as jest.Mock).mock.calls;
        expect(calls[0]?.[3]?.id).toBe('dest6_2'); // The middle destination with propagate=true
        expect(calls[0]?.[2]).toEqual(sampleEvent);
      });
    });
  });

  describe('logOncePerDestination', () => {
    let logFn: jest.Mock;
    let loggedDestinations: string[];

    beforeEach(() => {
      logFn = jest.fn();
      loggedDestinations = [];
    });

    it('should call log function on first invocation for a destination', () => {
      const destinationId = 'dest1';

      logOncePerDestination(destinationId, loggedDestinations, logFn);

      expect(logFn).toHaveBeenCalledTimes(1);
      expect(loggedDestinations).toContain(destinationId);
    });

    it('should not call log function on subsequent invocations for same destination', () => {
      const destinationId = 'dest1';

      // First call
      logOncePerDestination(destinationId, loggedDestinations, logFn);
      expect(logFn).toHaveBeenCalledTimes(1);

      // Second call with same destination
      logOncePerDestination(destinationId, loggedDestinations, logFn);
      expect(logFn).toHaveBeenCalledTimes(1); // Should still be 1
      expect(loggedDestinations).toEqual(['dest1']); // Should only have one entry
    });

    it('should call log function for different destinations', () => {
      const dest1 = 'dest1';
      const dest2 = 'dest2';

      logOncePerDestination(dest1, loggedDestinations, logFn);
      logOncePerDestination(dest2, loggedDestinations, logFn);

      expect(logFn).toHaveBeenCalledTimes(2);
      expect(loggedDestinations).toEqual([dest1, dest2]);
    });

    it('should handle multiple calls with mixed destinations correctly', () => {
      const dest1 = 'dest1';
      const dest2 = 'dest2';

      // Call sequence: dest1, dest2, dest1, dest2, dest1
      logOncePerDestination(dest1, loggedDestinations, logFn);
      logOncePerDestination(dest2, loggedDestinations, logFn);
      logOncePerDestination(dest1, loggedDestinations, logFn);
      logOncePerDestination(dest2, loggedDestinations, logFn);
      logOncePerDestination(dest1, loggedDestinations, logFn);

      expect(logFn).toHaveBeenCalledTimes(2); // Only first call for each destination
      expect(loggedDestinations).toEqual([dest1, dest2]);
    });

    it('should work with pre-populated logged destinations array', () => {
      const existingDest = 'existing_dest';
      const newDest = 'new_dest';
      loggedDestinations.push(existingDest);

      // Try to log for existing destination
      logOncePerDestination(existingDest, loggedDestinations, logFn);
      expect(logFn).not.toHaveBeenCalled();

      // Log for new destination
      logOncePerDestination(newDest, loggedDestinations, logFn);
      expect(logFn).toHaveBeenCalledTimes(1);
      expect(loggedDestinations).toEqual([existingDest, newDest]);
    });

    it('should handle empty string destination ID', () => {
      const destinationId = '';

      logOncePerDestination(destinationId, loggedDestinations, logFn);

      expect(logFn).toHaveBeenCalledTimes(1);
      expect(loggedDestinations).toContain('');
    });

    it('should handle complex destination IDs', () => {
      const complexId = 'destination-with-special_chars.123';

      logOncePerDestination(complexId, loggedDestinations, logFn);
      logOncePerDestination(complexId, loggedDestinations, logFn);

      expect(logFn).toHaveBeenCalledTimes(1);
      expect(loggedDestinations).toEqual([complexId]);
    });

    it('should call different log functions for same destination ID in different contexts', () => {
      const destinationId = 'dest1';
      const logFn2 = jest.fn();
      const separateLoggedDestinations: string[] = [];

      // First context
      logOncePerDestination(destinationId, loggedDestinations, logFn);

      // Second context with different loggedDestinations array
      logOncePerDestination(destinationId, separateLoggedDestinations, logFn2);

      expect(logFn).toHaveBeenCalledTimes(1);
      expect(logFn2).toHaveBeenCalledTimes(1);
      expect(loggedDestinations).toEqual([destinationId]);
      expect(separateLoggedDestinations).toEqual([destinationId]);
    });
  });

  describe('getDestinationId', () => {
    it('should return originalId when available', () => {
      const destination: Destination = {
        id: 'dest1_clone',
        originalId: 'dest1',
        displayName: 'Test Destination',
        userFriendlyId: 'TestDestination___dest1_clone',
        enabled: true,
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        config: {
          apiKey: 'test_key',
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable' as const,
        },
      };

      const result = getDestinationId(destination);
      expect(result).toBe('dest1');
    });

    it('should return id when originalId is not available', () => {
      const destination: Destination = {
        id: 'dest1',
        displayName: 'Test Destination',
        userFriendlyId: 'TestDestination___dest1',
        enabled: true,
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        config: {
          apiKey: 'test_key',
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable' as const,
        },
      };

      const result = getDestinationId(destination);
      expect(result).toBe('dest1');
    });

    it('should return id when originalId is null', () => {
      const destination: Destination = {
        id: 'dest1',
        originalId: null as any,
        displayName: 'Test Destination',
        userFriendlyId: 'TestDestination___dest1',
        enabled: true,
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        config: {
          apiKey: 'test_key',
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable' as const,
        },
      };

      const result = getDestinationId(destination);
      expect(result).toBe('dest1');
    });

    it('should return id when originalId is undefined', () => {
      const destination: Destination = {
        id: 'dest1',
        originalId: undefined,
        displayName: 'Test Destination',
        userFriendlyId: 'TestDestination___dest1',
        enabled: true,
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        config: {
          apiKey: 'test_key',
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable' as const,
        },
      };

      const result = getDestinationId(destination);
      expect(result).toBe('dest1');
    });
  });
});
