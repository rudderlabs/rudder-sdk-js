const CHANNEL = 'web';
// These are the top-level elements in the standard RudderStack event spec
const TOP_LEVEL_ELEMENTS = ['integrations', 'anonymousId', 'originalTimestamp'];
// Reserved elements in the context of standard RudderStack event spec
// Typically, these elements are not allowed to be overridden by the user
const CONTEXT_RESERVED_ELEMENTS = ['library', 'consentManagement', 'userAgent', 'ua-ch', 'screen'];
// Reserved elements in the standard RudderStack event spec
const RESERVED_ELEMENTS = [
  'anonymousId',
  'sentAt',
  'receivedAt',
  'timestamp',
  'originalTimestamp',
  'event',
  'messageId',
  'channel',
];
export { CHANNEL, TOP_LEVEL_ELEMENTS, CONTEXT_RESERVED_ELEMENTS, RESERVED_ELEMENTS };
