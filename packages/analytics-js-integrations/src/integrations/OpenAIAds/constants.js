export {
  OPENAI_ADS_NAME as NAME,
  OPENAI_ADS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'OpenAIAds';

const PIXEL_URL = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';

const EVENT_DATA_SHAPES = {
  app_installed: 'customer_action',
  app_opened: 'customer_action',
  checkout_started: 'contents',
  contents_viewed: 'contents',
  items_added: 'contents',
  order_created: 'contents',
  page_viewed: 'contents',
  appointment_scheduled: 'customer_action',
  lead_created: 'customer_action',
  registration_completed: 'customer_action',
  subscription_created: 'plan_enrollment',
  trial_started: 'plan_enrollment',
};

const STANDARD_EVENT_NAMES = Object.keys(EVENT_DATA_SHAPES);
const PIXEL_UNSUPPORTED_EVENTS = ['app_installed', 'app_opened'];

const CUSTOM_EVENT_TYPE = 'custom';

const LOGGER_MESSAGES = {
  MISSING_PIXEL_ID: 'OpenAI Ads pixelId is required for initialization',
  MISSING_SOURCE_KEY: 'OpenAI Ads source event key is required',
  MAPPING_NOT_FOUND: sourceKey => `OpenAI Ads event mapping not found for ${sourceKey}`,
  CUSTOM_MAPPING_MISSING_NAME: 'OpenAI Ads custom event mapping requires customEventName',
  CUSTOM_MAPPING_INVALID_NAME: 'OpenAI Ads custom event mapping has invalid customEventName',
  INVALID_MAPPING_DESTINATION: (sourceKey, mappedTo) =>
    `OpenAI Ads event mapping for ${sourceKey} has invalid destination ${mappedTo}`,
  UNSUPPORTED_PIXEL_EVENT: eventName => `OpenAI Ads event ${eventName} is unsupported by Measurement Pixel`,
  IDENTIFY_NO_USER_DATA: 'OpenAI Ads identify skipped because no usable user data was found',
  HASHED_PII_REJECTED: fieldName => `OpenAI Ads rejected apparent pre-hashed value for ${fieldName}`,
  INVALID_EVENT_DATA: reason => `OpenAI Ads event skipped: ${reason}`,
};

export {
  DIR_NAME,
  PIXEL_URL,
  STANDARD_EVENT_NAMES,
  PIXEL_UNSUPPORTED_EVENTS,
  EVENT_DATA_SHAPES,
  CUSTOM_EVENT_TYPE,
  LOGGER_MESSAGES,
};
