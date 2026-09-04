export {
  OPENAI_ADS_NAME as NAME,
  OPENAI_ADS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'OpenAIAds';

const PIXEL_URL = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
const COOKIE_OBREF = '__obref';

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

const ALLOWED_ACTION_SOURCES = [
  'web',
  'mobile_app',
  'offline',
  'physical_store',
  'phone_call',
  'email',
  'other',
];

const RESERVED_CUSTOM_PROPERTY_KEYS = [
  'action_source',
  'actionSource',
  'source_url',
  'sourceUrl',
  'oppref',
  'optOut',
  'opt_out',
  'obref',
  'currency',
  'amount',
  'value',
  'revenue',
  'contents',
  'products',
  'email',
  'emails',
  'phone',
  'phones',
  'phoneNumber',
  'phoneNumbers',
  'phone_number',
  'phone_numbers',
  'firstName',
  'firstNames',
  'first_name',
  'first_names',
  'lastName',
  'lastNames',
  'last_name',
  'last_names',
  'externalId',
  'externalIds',
  'external_id',
  'external_ids',
  'region',
  'regions',
  'state',
  'states',
  'postalCode',
  'postalCodes',
  'postal_code',
  'postal_codes',
  'zip',
  'zips',
  'zipCode',
  'zipCodes',
  'city',
  'cities',
  'country',
  'countries',
  'countryCode',
  'countryCodes',
  'android_advertising_id',
  'androidAdvertisingId',
  'ip_address',
  'ipAddress',
  'user_agent',
  'userAgent',
  'apiKey',
  'pixelId',
];

const LOGGER_MESSAGES = {
  MISSING_PIXEL_ID: 'OpenAI Ads pixelId is required for initialization',
  MISSING_SOURCE_KEY: 'OpenAI Ads source event key is required',
  MAPPING_NOT_FOUND: sourceKey => `OpenAI Ads event mapping not found for ${sourceKey}`,
  CUSTOM_MAPPING_MISSING_NAME: 'OpenAI Ads custom event mapping requires customEventName',
  UNSUPPORTED_PIXEL_EVENT: eventName => `OpenAI Ads event ${eventName} is unsupported by Measurement Pixel`,
  IDENTIFY_NO_USER_DATA: 'OpenAI Ads identify skipped because no usable user data was found',
  HASHED_PII_REJECTED: fieldName => `OpenAI Ads rejected apparent pre-hashed value for ${fieldName}`,
  INVALID_EVENT_DATA: reason => `OpenAI Ads event skipped: ${reason}`,
  FILTERED_EVENT: sourceKey => `OpenAI Ads event filtered by client-side settings for ${sourceKey}`,
};

export {
  DIR_NAME,
  PIXEL_URL,
  COOKIE_OBREF,
  STANDARD_EVENT_NAMES,
  PIXEL_UNSUPPORTED_EVENTS,
  EVENT_DATA_SHAPES,
  CUSTOM_EVENT_TYPE,
  ALLOWED_ACTION_SOURCES,
  RESERVED_CUSTOM_PROPERTY_KEYS,
  LOGGER_MESSAGES,
};
