import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader.js';
import {
  NAME,
  DISPLAY_NAME,
  TRAIT_MAPPINGS,
} from '@rudderstack/analytics-js-common/constants/integrations/Userpilot/constants';

const logger = new Logger(DISPLAY_NAME);

class Userpilot {
  /**
   * Creates an instance of Userpilot integration
   * @param {Object} config - The integration configuration
   * @param {string} config.token - App token
   * @param {string} config.endpoint - API endpoint
   * @param {Object} analytics - The RudderStack analytics instance
   * @param {Object} destinationInfo - Additional destination information
   */
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.token = config.token;
    this.endpoint = config.endpoint;

    this.name = NAME;

    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  /**
   * Initializes the Userpilot SDK
   */
  init() {
    return loadNativeSdk({ token: this.token, endpoint: this.endpoint })
  }

  /**
   * Checks if the Userpilot SDK is loaded
   * @returns {boolean} - Whether the SDK is loaded
   */
  isLoaded() {
    return !!window.userpilot;
  }

  /**
   * Checks if the integration is ready to send events
   * @returns {boolean} - Whether the integration is ready
   */
  isReady() {
    return this.isLoaded();
  }

  /**
   * Maps user traits to Userpilot format
   * @param {Object} traits - User traits from RudderStack
   * @returns {Object} - Mapped traits for Userpilot
   */
  mapTraits(traits) {
    if (!traits || typeof traits !== 'object') {
      return {};
    }

    const mappedTraits = { ...traits };

    Object.keys(TRAIT_MAPPINGS).forEach(traitKey => {
      if (mappedTraits[traitKey] !== undefined) {
        const userpilotKey = TRAIT_MAPPINGS[traitKey];
        mappedTraits[userpilotKey] = mappedTraits[traitKey];
        if (userpilotKey !== traitKey) {
          delete mappedTraits[traitKey];
        }
      }
    });

    return mappedTraits;
  }

  /**
   * Identify a user
   * @param {Object} rudderElement - The RudderStack element
   */
  identify(rudderElement) {
    const userId = rudderElement.message.userId;
    const traits = rudderElement.message.context.traits;

    if (!userId) {
      logger.error('No userId provided. Skipping identify call.');
      return;
    }

    const userProperties = this.mapTraits(traits);

    if (userProperties.company?.id) {
      userProperties.company = this.mapTraits(userProperties.company);
    }

    window.userpilot.identify(userId, userProperties);
  }

  /**
   * Associate the current user with a company/organization
   * @param {Object} rudderElement - The RudderStack element
   */
  group(rudderElement) {
    const { groupId, traits } = rudderElement.message;

    if (!groupId) {
      logger.error('Cannot associate user with undefined groupId');
      return;
    }

    const companyProperties = this.mapTraits(traits);

    window.userpilot.group(groupId, companyProperties);
  }

  /**
   * Track an event
   * @param {Object} rudderElement - The RudderStack element
   */
  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    if (!event) {
      logger.error('Cannot call track with undefined event');
      return;
    }

    window.userpilot.track(event, properties);
  }

  /**
   * Page call - reloads Userpilot content
   * @param {Object} rudderElement - The RudderStack element
   */
  page(rudderElement) {
    const { properties } = rudderElement.message;
    const url = properties?.url;

    if (url) {
      window.userpilot.reload({ url });
    } else {
      window.userpilot.reload();
    }
  }
}

export default Userpilot; 