const CHANNEL = 'web';

const TOP_LEVEL_ELEMENTS = ['integrations', 'anonymousId', 'originalTimestamp'];

const CONTEXT_RESERVED_ELEMENTS = ['library', 'consentManagement', 'userAgent', 'ua-ch', 'screen'];

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
