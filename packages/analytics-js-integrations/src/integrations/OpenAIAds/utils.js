/* eslint-disable unicorn/no-for-loop */
import { normalizeCurrency, toMinorUnits } from './currency';
import {
  CUSTOM_EVENT_TYPE,
  EVENT_DATA_SHAPES,
  LOGGER_MESSAGES,
  PIXEL_UNSUPPORTED_EVENTS,
  STANDARD_EVENT_NAMES,
} from './constants';

const SHA256_HEX_REGEX = /^[\da-f]{64}$/i;
const EMAIL_REGEX =
  /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
const CUSTOM_EVENT_NAME_REGEX = /^[\dA-Za-z](?:[\w-]{0,62}[\dA-Za-z])?$/;
const BLOCKED_PATH_SEGMENTS = ['__proto__', 'prototype', 'constructor'];
const SHA256_HASH = [];
const SHA256_K = [];

for (let candidate = 2, primeIndex = 0, composites = {}; primeIndex < 64; candidate += 1) {
  if (!composites[candidate]) {
    for (let multiple = candidate * candidate; multiple < 313; multiple += candidate) {
      composites[multiple] = true;
    }
    if (primeIndex < 8) {
      SHA256_HASH[primeIndex] = ((Math.sqrt(candidate) % 1) * 0x100000000) | 0;
    }
    SHA256_K[primeIndex] = ((Math.pow(candidate, 1 / 3) % 1) * 0x100000000) | 0;
    primeIndex += 1;
  }
}

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const isScalar = value =>
  ['string', 'number', 'boolean'].indexOf(typeof value) !== -1 && Number.isNaN(value) === false;

const trimString = value => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return undefined;
};

const rightRotate = (value, bits) => (value >>> bits) | (value << (32 - bits));

const sha256Hex = value => {
  const bytes = unescape(encodeURIComponent(value));
  const byteLength = bytes.length;
  const bitLength = byteLength * 8;
  const hash = SHA256_HASH.slice();
  const blocks = [];
  const words = new Array(64);
  for (let index = 0; index < byteLength; index += 1) {
    blocks[index >> 2] |= bytes.charCodeAt(index) << (24 - (index % 4) * 8);
  }
  blocks[byteLength >> 2] |= 0x80 << (24 - (byteLength % 4) * 8);
  blocks[(((byteLength + 8) >> 6) << 4) + 15] = bitLength;

  for (let offset = 0; offset < blocks.length; offset += 16) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = blocks[offset + index] || 0;
    }
    for (let index = 16; index < 64; index += 1) {
      const s0 =
        rightRotate(words[index - 15], 7) ^
        rightRotate(words[index - 15], 18) ^
        (words[index - 15] >>> 3);
      const s1 =
        rightRotate(words[index - 2], 17) ^
        rightRotate(words[index - 2], 19) ^
        (words[index - 2] >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) | 0;
    }

    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];
    for (let index = 0; index < 64; index += 1) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + SHA256_K[index] + words[index]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  let result = '';
  for (let index = 0; index < hash.length; index += 1) {
    result += `00000000${(hash[index] >>> 0).toString(16)}`.slice(-8);
  }
  return result;
};

const isEmptyValue = value => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  }
  return false;
};

const removeEmptyValues = obj => {
  const acc = {};
  const source = obj || {};
  const keys = Object.keys(source);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const value = source[key];
    if (!isEmptyValue(value)) {
      acc[key] = value;
    }
  }
  return acc;
};

const toArray = value => (Array.isArray(value) ? value : [value]);

const getNestedValue = (object, path) => {
  if (!path || typeof path !== 'string') {
    return undefined;
  }
  const normalizedPath = path.trim();
  if (
    !normalizedPath ||
    normalizedPath.startsWith('.') ||
    normalizedPath.endsWith('.') ||
    normalizedPath.includes('..') ||
    normalizedPath.includes('[') ||
    normalizedPath.includes(']') ||
    normalizedPath.startsWith('$') ||
    normalizedPath.includes('*')
  ) {
    return undefined;
  }
  const pathSegments = normalizedPath.split('.');
  if (pathSegments.some(segment => BLOCKED_PATH_SEGMENTS.includes(segment))) {
    return undefined;
  }

  return pathSegments.reduce((acc, key) => {
    if (
      acc === undefined ||
      acc === null ||
      key === '' ||
      !Object.prototype.hasOwnProperty.call(acc, key)
    ) {
      return undefined;
    }
    return acc[key];
  }, object);
};

const pick = (source, paths) => {
  for (let index = 0; index < paths.length; index += 1) {
    const path = paths[index];
    const value = getNestedValue(source, path);
    if (!isEmptyValue(value)) {
      return value;
    }
  }
  return undefined;
};

const pickString = (source, paths) => {
  for (let index = 0; index < paths.length; index += 1) {
    const path = paths[index];
    const value = trimString(getNestedValue(source, path));
    if (value) {
      return value;
    }
  }
  return undefined;
};

const pickList = (source, paths) => {
  const value = pick(source, paths);
  return isEmptyValue(value) ? [] : toArray(value);
};

const normalizeMappingKey = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');

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

const resolveEvent = (message, messageType, eventMappingIndex) => {
  const sourceKey =
    messageType === 'track' ? trimString(message?.event) : trimString(message?.name);
  if (!sourceKey) {
    return { error: LOGGER_MESSAGES.MISSING_SOURCE_KEY };
  }

  const mappingRow = eventMappingIndex?.[normalizeMappingKey(sourceKey)];
  if (!mappingRow) {
    return { error: LOGGER_MESSAGES.MAPPING_NOT_FOUND(sourceKey) };
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
      sourceKey,
      mappingRow,
      eventName: CUSTOM_EVENT_TYPE,
      customEventName,
      isCustom: true,
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
    sourceKey,
    mappingRow,
    eventName: mappedTo,
    isCustom: false,
    dataType: EVENT_DATA_SHAPES[mappedTo],
  };
};

const getDeduplicationId = (message, mappingRow) => {
  const deduplicationKey = trimString(mappingRow?.deduplicationKey);
  if (deduplicationKey) {
    const configuredValue = getNestedValue(message, deduplicationKey);
    if (!isEmptyValue(configuredValue)) {
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
  return email && EMAIL_REGEX.test(email) ? email : undefined;
};

const normalizePhone = value => {
  const phone = trimString(value)?.replace(/\D/g, '').replace(/^0+/, '');
  return phone && phone.length >= 6 && phone.length <= 15 ? phone : undefined;
};

const normalizeName = value => {
  const name = trimString(value)
    ?.toLowerCase()
    .replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~\-]/g, '')
    .trim();
  return name || undefined;
};

const normalizeExternalId = value => trimString(value);

const traitPaths = fields =>
  fields
    .split(' ')
    .reduce((paths, field) => paths.concat(`traits.${field}`, `context.traits.${field}`), []);

const USER_FIELD_SPECS = [
  ['email_sha256', 'email', normalizeEmail, traitPaths('emails email')],
  ['phone_number_sha256', 'phone', normalizePhone, traitPaths('phoneNumbers phone_numbers phones phone')],
  [
    'external_id_sha256',
    'external_id',
    normalizeExternalId,
    traitPaths('externalIds external_ids externalId external_id').concat('userId'),
  ],
  [
    'first_name_sha256',
    'first_name',
    normalizeName,
    traitPaths('firstNames first_names firstName first_name'),
  ],
  ['last_name_sha256', 'last_name', normalizeName, traitPaths('lastNames last_names lastName last_name')],
  ['region', undefined, undefined, traitPaths('regions region')],
  ['postal_code', undefined, undefined, traitPaths('postalCodes postal_codes postalCode postal_code')],
  ['city', undefined, undefined, traitPaths('cities').concat('traits.address.city', 'context.traits.address.city', traitPaths('city'))],
  ['country', undefined, undefined, traitPaths('countries country')],
];

const getFirstHash = (message, spec, logger) => {
  const paths = spec[3];
  const normalize = spec[2];
  const values = pickList(message, paths);
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const raw = trimString(value);
    if (!raw) {
      continue;
    }
    if (SHA256_HEX_REGEX.test(raw)) {
      if (logger) {
        logger.error(LOGGER_MESSAGES.HASHED_PII_REJECTED(spec[1]));
      }
      continue;
    }
    const normalized = normalize(raw);
    if (normalized) {
      return sha256Hex(normalized);
    }
  }
  return undefined;
};

const buildUserData = (message = {}, logger) =>
  removeEmptyValues(
    USER_FIELD_SPECS.reduce((user, spec) => {
      user[spec[0]] = spec[2] ? getFirstHash(message, spec, logger) : pickString(message, spec[3]);
      return user;
    }, {}),
  );

const resolveCurrency = (properties, defaultCurrency) => {
  const rawCurrency = trimString(properties?.currency) || trimString(defaultCurrency);
  if (!rawCurrency) {
    return undefined;
  }
  return normalizeCurrency(rawCurrency);
};

const getPositiveInteger = value => {
  if (isEmptyValue(value)) {
    return undefined;
  }
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : undefined;
};

const CONTENT_FIELD_SPECS = [
  ['id', 'id content_id contentId item_id itemId product_id productId sku'],
  ['name', 'name title product_name productName'],
  ['content_type', 'content_type contentType type category product_category'],
];

const getMappedContentItem = (item, eventCurrency, defaultCurrency) => {
  if (!isPlainObject(item)) {
    return undefined;
  }

  const content = CONTENT_FIELD_SPECS.reduce((acc, spec) => {
    acc[spec[0]] = trimString(pick(item, spec[1].split(' ')));
    return acc;
  }, {});

  const quantity = getPositiveInteger(pick(item, ['quantity', 'count']));
  if (quantity !== undefined) {
    content.quantity = quantity;
  }

  const itemAmountValue = pick(item, ['amount', 'value', 'price']);
  const itemCurrency = normalizeCurrency(
    pickString(item, ['currency', 'currency_code', 'currencyCode']) || eventCurrency || defaultCurrency,
  );
  const itemAmount = toMinorUnits(itemAmountValue, itemCurrency);
  if (itemAmount !== undefined) {
    content.amount = itemAmount;
    content.currency = itemCurrency;
  }

  return removeEmptyValues(content);
};

const buildContents = (properties, defaultCurrency) => {
  const contentInput = !isEmptyValue(properties?.contents)
    ? properties.contents
    : properties?.products;
  if (isEmptyValue(contentInput)) {
    return undefined;
  }

  const eventCurrency = resolveCurrency(properties, defaultCurrency);
  const contents = toArray(contentInput)
    .map(contentItem => getMappedContentItem(contentItem, eventCurrency, defaultCurrency))
    .filter(content => !isEmptyValue(content));

  return contents.length > 0 ? contents : undefined;
};

const getOptOut = properties => {
  const optOutValue = pick(properties, ['optOut', 'opt_out']);
  return typeof optOutValue === 'boolean' ? optOutValue : undefined;
};

const buildEventData = (message, resolvedEvent, config) => {
  const properties = isPlainObject(message?.properties) ? message.properties : {};
  const { dataType } = resolvedEvent;
  const eventData = { type: dataType };

  const eventCurrency = resolveCurrency(properties, config?.defaultCurrency);
  const amount = toMinorUnits(pick(properties, ['amount', 'value', 'revenue']), eventCurrency);
  if (amount !== undefined) {
    eventData.amount = amount;
    eventData.currency = eventCurrency;
  }

  if (dataType === 'plan_enrollment' || dataType === CUSTOM_EVENT_TYPE) {
    eventData.plan_id = pickString(properties, ['plan_id', 'planId']);
  }

  if (dataType !== 'customer_action') {
    eventData.contents = buildContents(properties, config?.defaultCurrency);
  }

  return { eventData: removeEmptyValues(eventData) };
};

const buildEventOptions = (message, resolvedEvent) => {
  const deduplicationResult = getDeduplicationId(message, resolvedEvent.mappingRow);
  if (deduplicationResult.error) {
    return { error: deduplicationResult.error };
  }

  const properties = isPlainObject(message?.properties) ? message.properties : {};
  return {
    eventOptions: removeEmptyValues({
      event_id: deduplicationResult.id,
      custom_event_name: resolvedEvent.customEventName,
      opt_out: getOptOut(properties),
    }),
  };
};

export {
  buildEventData,
  buildEventOptions,
  buildUserData,
  getEventMappingIndex,
  removeEmptyValues,
  resolveEvent,
};
