import sha256 from 'crypto-js/sha256';
import get from 'get-value';
import { removeUndefinedAndNullValues, validateEmail } from '../../utils/commonUtils';
import { getDefinedTraits } from '../../utils/utils';
import { normalizeCurrency, toMinorUnits } from './currency';
import {
  CUSTOM_EVENT_TYPE,
  EVENT_DATA_SHAPES,
  LOGGER_MESSAGES,
  PIXEL_UNSUPPORTED_EVENTS,
  STANDARD_EVENT_NAMES,
} from './constants';

const SHA256_HEX_REGEX = /^[\da-f]{64}$/i;
const CUSTOM_EVENT_NAME_REGEX = /^[\dA-Za-z](?:[\w-]{0,62}[\dA-Za-z])?$/;
const BLOCKED_PATH_SEGMENTS = ['__proto__', 'prototype', 'constructor'];

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const isScalar = value =>
  ['string', 'number', 'boolean'].indexOf(typeof value) !== -1 && !Number.isNaN(value);

const isPresent = value => {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !isPlainObject(value) || Object.keys(value).length > 0;
};

const trimString = value => {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return undefined;
};

const toArray = value => (Array.isArray(value) ? value : [value]);

/**
 * Returns the first present value among the given keys/paths.
 */
const pickFirst = (source, paths) => {
  for (const path of paths) {
    const value = get(source, path);
    if (isPresent(value)) {
      return value;
    }
  }
  return undefined;
};

const pickFirstString = (source, paths) => trimString(pickFirst(source, paths));

/**
 * Resolves a destination-config supplied dot path. `get-value` walks the prototype chain,
 * so segments that would resolve to inherited members are rejected.
 */
const getConfiguredValue = (source, path) => {
  const normalizedPath = trimString(path);
  if (
    !normalizedPath ||
    normalizedPath.split('.').some(segment => BLOCKED_PATH_SEGMENTS.includes(segment))
  ) {
    return undefined;
  }
  return get(source, normalizedPath);
};

const normalizeMappingKey = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');

/**
 * Indexes the configured event mappings by source event name. A null-prototype accumulator keeps
 * source events named after `Object` members (e.g. `constructor`) from resolving to inherited values.
 */
const getEventMappingIndex = eventMapping =>
  (Array.isArray(eventMapping) ? eventMapping : []).reduce((acc, row) => {
    const key = normalizeMappingKey(row?.from);
    if (key && !acc[key]) {
      acc[key] = row;
    }
    return acc;
  }, Object.create(null));

const isValidCustomEventName = value =>
  CUSTOM_EVENT_NAME_REGEX.test(value) && !STANDARD_EVENT_NAMES.includes(value.toLowerCase());

const getDefaultPageEvent = () => ({
  eventName: 'page_viewed',
  dataType: EVENT_DATA_SHAPES.page_viewed,
});

const resolveEvent = (message, messageType, eventMappingIndex) => {
  const sourceKey =
    messageType === 'track' ? trimString(message?.event) : trimString(message?.name);
  if (!sourceKey) {
    return messageType === 'page'
      ? getDefaultPageEvent()
      : { error: LOGGER_MESSAGES.MISSING_SOURCE_KEY };
  }

  const mappingRow = eventMappingIndex?.[normalizeMappingKey(sourceKey)];
  if (!mappingRow) {
    return messageType === 'page'
      ? getDefaultPageEvent()
      : { error: LOGGER_MESSAGES.MAPPING_NOT_FOUND(sourceKey) };
  }

  const mappedTo = trimString(mappingRow.to);

  if (mappedTo === CUSTOM_EVENT_TYPE) {
    const customEventName = trimString(mappingRow.customEventName);
    if (!customEventName) {
      return { error: LOGGER_MESSAGES.CUSTOM_MAPPING_MISSING_NAME };
    }
    if (!isValidCustomEventName(customEventName)) {
      return { error: LOGGER_MESSAGES.CUSTOM_MAPPING_INVALID_NAME };
    }
    return {
      mappingRow,
      eventName: CUSTOM_EVENT_TYPE,
      customEventName,
      dataType: CUSTOM_EVENT_TYPE,
    };
  }

  if (!STANDARD_EVENT_NAMES.includes(mappedTo)) {
    return { error: LOGGER_MESSAGES.INVALID_MAPPING_DESTINATION(sourceKey, mappedTo) };
  }
  if (PIXEL_UNSUPPORTED_EVENTS.includes(mappedTo)) {
    return { error: LOGGER_MESSAGES.UNSUPPORTED_PIXEL_EVENT(mappedTo) };
  }

  return {
    mappingRow,
    eventName: mappedTo,
    dataType: EVENT_DATA_SHAPES[mappedTo],
  };
};

const getDeduplicationId = (message, mappingRow) => {
  const deduplicationKey = trimString(mappingRow?.deduplicationKey);
  if (deduplicationKey) {
    const configuredValue = getConfiguredValue(message, deduplicationKey);
    if (isPresent(configuredValue)) {
      if (!isScalar(configuredValue)) {
        return {
          error: `OpenAI Ads deduplication key "${deduplicationKey}" must resolve to a scalar value`,
        };
      }
      return { id: trimString(configuredValue) };
    }
  }
  return { id: trimString(message?.messageId) };
};

const normalizeEmail = value => {
  const email = trimString(value)?.toLowerCase();
  return email && validateEmail(email) ? email : undefined;
};

const normalizePhone = value => {
  const phone = trimString(value)?.replace(/\D/g, '').replace(/^0+/, '');
  return phone && phone.length >= 6 && phone.length <= 15 ? phone : undefined;
};

// Names are lowercased with whitespace and ASCII punctuation removed; non-ASCII characters stay.
const normalizeName = value =>
  trimString(value)
    ?.toLowerCase()
    .replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~\-]/g, '') || undefined;

// External IDs are only trimmed; the OpenAI spec requires the original case to be preserved.
const normalizeExternalId = value => trimString(value);

const hashUserValue = (value, fieldName, normalize, logger) => {
  const raw = trimString(value);
  if (!raw) {
    return undefined;
  }
  if (SHA256_HEX_REGEX.test(raw)) {
    logger?.error(LOGGER_MESSAGES.HASHED_PII_REJECTED(fieldName));
    return undefined;
  }
  const normalized = normalize(raw);
  return normalized ? sha256(normalized).toString() : undefined;
};

/**
 * Builds the singular, scalar Measurement Pixel `user` object.
 * The plural `*_sha256` list fields are Conversions API only and are not sent from device mode.
 */
const buildUserData = (message = {}, logger) => {
  // `userId` here is `getDefinedTraits`' resolved identifier: `userId`, then `anonymousId`.
  // This mirrors the cloud-mode `external_ids_sha256` mapping (INT-7118), so the pixel and the
  // Conversions API derive the conversion match key from the same identifier.
  const { email, phone, firstName, lastName, userId, city, state, country, postalCode } =
    getDefinedTraits(message);

  return removeUndefinedAndNullValues({
    email_sha256: hashUserValue(email, 'email', normalizeEmail, logger),
    phone_number_sha256: hashUserValue(phone, 'phone', normalizePhone, logger),
    external_id_sha256: hashUserValue(userId, 'external_id', normalizeExternalId, logger),
    first_name_sha256: hashUserValue(firstName, 'first_name', normalizeName, logger),
    last_name_sha256: hashUserValue(lastName, 'last_name', normalizeName, logger),
    city: trimString(city),
    region: trimString(state),
    postal_code: trimString(postalCode),
    country: trimString(country),
  });
};

const resolveCurrency = (properties, defaultCurrency) =>
  normalizeCurrency(trimString(properties?.currency) || trimString(defaultCurrency));

const getPositiveInteger = value => {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : undefined;
};

const CONTENT_ID_PATHS = [
  'id',
  'content_id',
  'contentId',
  'item_id',
  'itemId',
  'product_id',
  'productId',
  'sku',
];
const CONTENT_NAME_PATHS = ['name', 'title', 'product_name', 'productName'];
const CONTENT_TYPE_PATHS = ['content_type', 'contentType', 'type', 'category', 'product_category'];

// Only the pixel-documented `contents[]` fields are forwarded; `group_id` and `variant_dict`
// are Conversions API only.
const getMappedContentItem = (item, eventCurrency, defaultCurrency) => {
  if (!isPlainObject(item)) {
    return undefined;
  }

  const itemCurrency = normalizeCurrency(
    pickFirstString(item, ['currency', 'currency_code', 'currencyCode']) ||
      eventCurrency ||
      defaultCurrency,
  );
  const itemAmount = toMinorUnits(pickFirst(item, ['amount', 'value', 'price']), itemCurrency);

  const content = removeUndefinedAndNullValues({
    id: pickFirstString(item, CONTENT_ID_PATHS),
    name: pickFirstString(item, CONTENT_NAME_PATHS),
    content_type: pickFirstString(item, CONTENT_TYPE_PATHS),
    quantity: getPositiveInteger(pickFirst(item, ['quantity', 'count'])),
    amount: itemAmount,
    currency: itemAmount === undefined ? undefined : itemCurrency,
  });

  return Object.keys(content).length > 0 ? content : undefined;
};

const buildContents = (properties, defaultCurrency) => {
  const contentInput = pickFirst(properties, ['contents', 'products']);
  if (!isPresent(contentInput)) {
    return undefined;
  }

  const eventCurrency = resolveCurrency(properties, defaultCurrency);
  const contents = toArray(contentInput)
    .map(contentItem => getMappedContentItem(contentItem, eventCurrency, defaultCurrency))
    .filter(Boolean);

  return contents.length > 0 ? contents : undefined;
};

const getOptOut = properties => {
  const optOutValue = pickFirst(properties, ['optOut', 'opt_out']);
  return typeof optOutValue === 'boolean' ? optOutValue : undefined;
};

/**
 * Builds the pixel event data. Only `type`, `amount`, `currency`, `contents` and `plan_id`
 * are documented for the Measurement Pixel.
 */
const buildEventData = (message, resolvedEvent, config) => {
  const properties = isPlainObject(message?.properties) ? message.properties : {};
  const { dataType } = resolvedEvent;

  const eventCurrency = resolveCurrency(properties, config?.defaultCurrency);
  const amount = toMinorUnits(pickFirst(properties, ['amount', 'value', 'revenue']), eventCurrency);
  const supportsPlanId = dataType === 'plan_enrollment' || dataType === CUSTOM_EVENT_TYPE;

  return removeUndefinedAndNullValues({
    type: dataType,
    amount,
    currency: amount === undefined ? undefined : eventCurrency,
    plan_id: supportsPlanId ? pickFirstString(properties, ['plan_id', 'planId']) : undefined,
    contents:
      dataType === 'customer_action'
        ? undefined
        : buildContents(properties, config?.defaultCurrency),
  });
};

/**
 * Builds the pixel options object: `event_id`, `custom_event_name` and `opt_out` are
 * options fields, not event data.
 */
const buildEventOptions = (message, resolvedEvent) => {
  const deduplicationResult = getDeduplicationId(message, resolvedEvent.mappingRow);
  if (deduplicationResult.error) {
    return { error: deduplicationResult.error };
  }

  const properties = isPlainObject(message?.properties) ? message.properties : {};
  return {
    eventOptions: removeUndefinedAndNullValues({
      event_id: deduplicationResult.id,
      custom_event_name: resolvedEvent.customEventName,
      opt_out: getOptOut(properties),
    }),
  };
};

export { buildEventData, buildEventOptions, buildUserData, getEventMappingIndex, resolveEvent };
