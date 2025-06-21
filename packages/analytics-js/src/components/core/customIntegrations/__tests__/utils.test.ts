import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { canAddCustomIntegration } from '../utils';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';

describe('customIntegrations - utils', () => {
  let mockLogger: ILogger = defaultLogger;
  let mockState: ApplicationState;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = defaultLogger;

    // Mock minimal state structure needed for testing
    mockState = {
      lifecycle: {
        status: { value: 'loaded' },
        loaded: { value: true },
      },
      nativeDestinations: {
        configuredDestinations: { value: [] as Destination[] },
      },
    } as ApplicationState;
  });

  describe('canAddCustomIntegration', () => {
    it('should return true when not buffered and SDK is not loaded', () => {
      mockState.lifecycle.status.value = 'pluginsLoading';

      const result = canAddCustomIntegration(false, mockState, mockLogger);

      expect(result).toBe(true);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return true when buffered invocation regardless of SDK state', () => {
      mockState.lifecycle.status.value = 'ready';

      const result = canAddCustomIntegration(true, mockState, mockLogger);

      expect(result).toBe(true);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return false and log error when SDK is loaded and not buffered', () => {
      mockState.lifecycle.status.value = 'loaded';

      const result = canAddCustomIntegration(false, mockState, mockLogger);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Custom integrations can only be added before the SDK is loaded.',
      );
    });

    it('should return false when SDK status is destinationsLoading and not buffered', () => {
      mockState.lifecycle.status.value = 'destinationsLoading';

      const result = canAddCustomIntegration(false, mockState, mockLogger);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Custom integrations can only be added before the SDK is loaded.',
      );
    });

    it('should return false when SDK status is destinationsReady and not buffered', () => {
      mockState.lifecycle.status.value = 'destinationsReady';

      const result = canAddCustomIntegration(false, mockState, mockLogger);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Custom integrations can only be added before the SDK is loaded.',
      );
    });

    it('should return false when SDK status is ready and not buffered', () => {
      mockState.lifecycle.status.value = 'ready';

      const result = canAddCustomIntegration(false, mockState, mockLogger);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Custom integrations can only be added before the SDK is loaded.',
      );
    });

    it('should return false when SDK status is readyExecuted and not buffered', () => {
      mockState.lifecycle.status.value = 'readyExecuted';

      const result = canAddCustomIntegration(false, mockState, mockLogger);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Custom integrations can only be added before the SDK is loaded.',
      );
    });

    it('should return true for other SDK statuses when not buffered', () => {
      const allowedStatuses = [
        'mounted',
        'browserCapabilitiesReady',
        'configured',
        'pluginsLoading',
        'pluginsReady',
        'initialized',
      ];

      allowedStatuses.forEach(status => {
        jest.clearAllMocks();
        mockState.lifecycle.status.value = status as any;

        const result = canAddCustomIntegration(false, mockState, mockLogger);

        expect(result).toBe(true);
        expect(mockLogger.error).not.toHaveBeenCalled();
      });
    });
  });
});
