const NAME = 'OPENAI_ADS';
const DISPLAY_NAME = 'OpenAI Ads';
const DIR_NAME = 'OpenAIAds';

const PIXEL_URL = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
const COOKIE_OBREF = '__obref';

const STANDARD_EVENT_NAMES = [
  'app_installed',
  'app_opened',
  'appointment_scheduled',
  'checkout_started',
  'contents_viewed',
  'items_added',
  'lead_created',
  'order_created',
  'page_viewed',
  'registration_completed',
  'subscription_created',
  'trial_started',
];

const PIXEL_UNSUPPORTED_EVENTS = ['app_installed', 'app_opened'];

const EVENT_DATA_SHAPES = {
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
  'url',
  'oppref',
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
  UNSUPPORTED_PIXEL_EVENT: eventName => `OpenAI Ads event ${eventName} is unsupported by Measurement Pixel`,
  IDENTIFY_NO_USER_DATA: 'OpenAI Ads identify skipped because no usable user data was found',
  HASHED_PII_REJECTED: fieldName => `OpenAI Ads rejected apparent pre-hashed value for ${fieldName}`,
  INVALID_EVENT_DATA: reason => `OpenAI Ads event skipped: ${reason}`,
  FILTERED_EVENT: sourceKey => `OpenAI Ads event filtered by client-side settings for ${sourceKey}`,
};

const CNameMapping = {
  [NAME]: NAME,
  OpenAIAds: NAME,
  OPENAIADS: NAME,
  'OpenAI Ads': NAME,
  'openai ads': NAME,
};

export {
  NAME,
  DISPLAY_NAME,
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
  CNameMapping,
};
