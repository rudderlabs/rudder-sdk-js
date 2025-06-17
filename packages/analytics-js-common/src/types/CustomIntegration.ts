import type { RsaEvent } from './Event';
import type { RsaAnalyticsInstance } from './IRudderAnalytics';
import type { RsaLogger } from './Logger';

/**
 * Core interface for custom device mode integrations
 * Defines the contract that all custom integrations must implement
 */
export interface CustomIntegration {
  /**
   * Unique name identifier for the integration
   * @required
   */
  name: string;

  /**
   * Initialize the integration
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @optional
   */
  init?(analytics: RsaAnalyticsInstance, logger: RsaLogger): void;

  /**
   * Check if the integration is ready to process events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @returns boolean indicating whether the integration is ready
   * @required
   */
  isReady(analytics: RsaAnalyticsInstance, logger: RsaLogger): boolean;

  /**
   * Process track events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The track event payload to process
   * @optional
   */
  track?(analytics: RsaAnalyticsInstance, logger: RsaLogger, event: RsaEvent): void;

  /**
   * Process page events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The page event payload to process
   * @optional
   */
  page?(analytics: RsaAnalyticsInstance, logger: RsaLogger, event: RsaEvent): void;

  /**
   * Process identify events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The identify event payload to process
   * @optional
   */
  identify?(analytics: RsaAnalyticsInstance, logger: RsaLogger, event: RsaEvent): void;

  /**
   * Process group events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The group event payload to process
   * @optional
   */
  group?(analytics: RsaAnalyticsInstance, logger: RsaLogger, event: RsaEvent): void;

  /**
   * Process alias events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The alias event payload to process
   * @optional
   */
  alias?(analytics: RsaAnalyticsInstance, logger: RsaLogger, event: RsaEvent): void;
}

/**
 * Type for the custom integration to be used in addCustomIntegration API
 */
export type RsaCustomIntegration = Pick<
  CustomIntegration,
  'init' | 'isReady' | 'track' | 'page' | 'identify' | 'group' | 'alias'
>;
