const CHANNEL = 'web';

const TOP_LEVEL_ELEMENTS = ['integrations', 'anonymousId', 'originalTimestamp'];

const CONTEXT_RESERVED_ELEMENTS = ['library', 'consentManagement'];

const RESERVED_ELEMENTS = [
  'anonymous_id',
  'id', // TODO: Is this valid?
  'sent_at',
  'received_at',
  'timestamp',
  'original_timestamp',
  'event_text',
  'event',
];

export { CHANNEL, TOP_LEVEL_ELEMENTS, CONTEXT_RESERVED_ELEMENTS, RESERVED_ELEMENTS };
