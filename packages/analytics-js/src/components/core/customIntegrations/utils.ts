import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';

/**
 * Checks if the SDK is in a state where custom integrations can be added
 * Do not allow adding custom integrations if the SDK is loaded
 * except when the invocation is buffered
 * @param isBufferedInvocation - Whether the addCustomIntegration method call is buffered
 * @param state - Application state
 * @param logger - Logger instance
 * @returns boolean indicating if custom integrations can be added
 */
const canAddCustomIntegration = (
  isBufferedInvocation: boolean,
  state: ApplicationState,
  logger: ILogger,
): boolean => {
  // Allow adding custom integrations after SDK is loaded but warn if destinations are already ready
  if (
    !isBufferedInvocation &&
    (state.lifecycle.status.value === 'loaded' ||
      state.lifecycle.status.value === 'destinationsLoading' ||
      state.lifecycle.status.value === 'destinationsReady' ||
      state.lifecycle.status.value === 'ready' ||
      state.lifecycle.status.value === 'readyExecuted')
  ) {
    logger.error('Custom integrations can only be added before the SDK is loaded.');
    return false;
  }

  return true;
};

export { canAddCustomIntegration };
