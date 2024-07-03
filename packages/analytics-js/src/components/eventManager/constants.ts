const CHANNEL = 'web';

// These are the top-level elements in the standard RudderStack event spec
const TOP_LEVEL_ELEMENTS = ['integrations', 'anonymousId', 'originalTimestamp'];

// Reserved elements in the context of standard RudderStack event spec
// Typically, these elements are not allowed to be overridden by the user
const CONTEXT_RESERVED_ELEMENTS = ['library', 'consentManagement', 'userAgent', 'ua-ch', 'screen'];

// Reserved elements in the standard RudderStack event spec
const RESERVED_ELEMENTS = [
  'id',
  'anonymous_id',
  'user_id',
  'sent_at',
  'timestamp',
  'received_at',
  'original_timestamp',
  'event',
  'event_text',
  'channel',
  'context_ip',
  'context_request_ip',
  'context_passed_ip',
  'group_id',
  'previous_id',
];

export { CHANNEL, TOP_LEVEL_ELEMENTS, CONTEXT_RESERVED_ELEMENTS, RESERVED_ELEMENTS };
