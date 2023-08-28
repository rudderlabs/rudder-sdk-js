import {
  ApiCallback,
  ApiObject,
  IntegrationOptions,
} from '@rudderstack/analytics-js-service-worker/types';

export interface IAnalytics {
  /**
   * Send an identify `message`.
   *
   * @param {Object} message
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.traits (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */
  identify(
    message: {
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      traits?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics;
  /**
   * Send a group `message`.
   *
   * @param {Object} message
   * @param {String} message.groupId
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.traits (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */
  group(
    message: {
      groupId: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      traits?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics;
  /**
   * Send a track `message`.
   *
   * @param {Object} message
   * @param {String} message.event
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */
  track(
    message: {
      event: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      properties?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics;
  /**
   * Send a page `message`.
   *
   * @param {Object} message
   * @param {String} message.name
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */
  page(
    message: {
      name: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      properties?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics;

  /**
   * Send an alias `message`.
   *
   * @param {Object} message
   * @param {String} message.previousId
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */
  alias(
    message: {
      previousId: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      properties?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics;

  /**
   * Flush the current queue
   *
   * @param {Function} [callback] (optional)
   * @return
   */
  flush(callback?: ApiCallback): void;
}
