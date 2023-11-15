/* eslint-disable sonarjs/no-duplicate-string */
import type from 'component-type';
import join from 'join-component';
import assert from 'assert';

// RudderStack messages can be a maximum of 32kb.
// eslint-disable-next-line no-bitwise
const MAX_SIZE = 32 << 10;

/**
 * Validate a "track" event.
 */

const validateTrackEvent = (event: any) => {
  assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
  assert(event.event, 'You must pass an "event".');
};

/**
 * Validate a "group" event.
 */

const validateGroupEvent = (event: any) => {
  assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
  assert(event.groupId, 'You must pass a "groupId".');
};

/**
 * Validate a "identify" event.
 */

const validateIdentifyEvent = (event: any) => {
  assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
};

/**
 * Validate a "page" event.
 */

const validatePageEvent = (event: any) => {
  assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
};

/**
 * Validate a "screen" event.
 */

const validateScreenEvent = (event: any) => {
  assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
};

/**
 * Validate an "alias" event.
 */

const validateAliasEvent = (event: any) => {
  assert(event.userId, 'You must pass a "userId".');
  assert(event.previousId, 'You must pass a "previousId".');
};

/**
 * Validation rules.
 */

const genericValidationRules = {
  anonymousId: ['string', 'number'],
  category: 'string',
  context: 'object',
  event: 'string',
  groupId: ['string', 'number'],
  integrations: 'object',
  name: 'string',
  previousId: ['string', 'number'],
  timestamp: 'date',
  userId: ['string', 'number'],
  type: 'string',
};

/**
 * Validate an event object.
 */

const validateGenericEvent = (event: any) => {
  assert(type(event) === 'object', 'You must pass a message object.');

  const json = JSON.stringify(event);
  // Strings are variable byte encoded, so json.length is not sufficient.
  assert(Buffer.byteLength(json, 'utf8') < MAX_SIZE, 'Your message must be < 32kb.');

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in genericValidationRules) {
    const val = event[key];
    if (!val) {
      // eslint-disable-next-line no-continue
      continue;
    }
    let rule = (genericValidationRules as any)[key];
    if (type(rule) !== 'array') {
      rule = [rule];
    }
    const a = rule[0] === 'object' ? 'an' : 'a';
    assert(
      rule.some((e: any) => type(val) === e),
      `"${key}" must be ${a} ${join(rule, 'or')}.`,
    );
  }
};

/**
 * Validate an event.
 */
const looselyValidateEvent = (event: any, type?: string) => {
  validateGenericEvent(event);
  // eslint-disable-next-line no-param-reassign
  type = type || event.type;
  assert(type, 'You must pass an event type.');

  switch (type) {
    case 'track':
      return validateTrackEvent(event);
    case 'group':
      return validateGroupEvent(event);
    case 'identify':
      return validateIdentifyEvent(event);
    case 'page':
      return validatePageEvent(event);
    case 'screen':
      return validateScreenEvent(event);
    case 'alias':
      return validateAliasEvent(event);
    default:
      return assert(0, `Invalid event type: "${type}"`);
  }
};

export { looselyValidateEvent };
