export const TRACK = 'track';
export const PAGE = 'page';
export const IDENTIFY = 'identify';
export const GROUP = 'group';
export const ALIAS = 'alias';

export const CHANNEL = 'web';

export const TOP_LEVEL_ELEMENTS = ['integrations', 'anonymousId', 'originalTimestamp'];

// TODO: Check if more elements like 'app' can be added
export const SYSTEM_KEYWORDS = ['library', 'consentManagement'];

export const RESERVED_ELEMENTS = [
  'anonymous_id',
  'id', // TODO: Is this valid?
  'sent_at',
  'received_at',
  'timestamp',
  'original_timestamp',
  'event_text',
  'event',
];
