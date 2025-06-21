import type { RSAEvent } from './Event';
import type { RSAnalytics } from './IRudderAnalytics';
import type { RSALogger } from './Logger';

/**
 * Type for the custom integration to be used in addCustomIntegration API
 * Defines the contract that all custom integrations must implement
 */
export type RSACustomIntegration = {
  /**
   * Initialize the integration
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @optional
   */
  init?: (analytics: RSAnalytics, logger: RSALogger) => void;

  /**
   * Check if the integration is ready to process events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @returns boolean indicating whether the integration is ready
   * @required
   */
  isReady: (analytics: RSAnalytics, logger: RSALogger) => boolean;

  /**
   * Process track events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The track event payload to process
   * @optional
   */
  track?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process page events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The page event payload to process
   * @optional
   */
  page?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process identify events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The identify event payload to process
   * @optional
   */
  identify?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process group events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The group event payload to process
   * @optional
   */
  group?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process alias events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The alias event payload to process
   * @optional
   */
  alias?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;
};
