import sha256 from 'crypto-js/sha256';
import { normalizeCurrency, toMinorUnits } from './currency';
import {
  ALLOWED_ACTION_SOURCES,
  CUSTOM_EVENT_TYPE,
  EVENT_DATA_SHAPES,
  LOGGER_MESSAGES,
  PIXEL_UNSUPPORTED_EVENTS,
  RESERVED_CUSTOM_PROPERTY_KEYS,
  STANDARD_EVENT_NAMES,
} from './constants';

const SHA256_HEX_REGEX = /^[\da-f]{64}$/i;
const EMAIL_REGEX =
  /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;

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

const removeEmptyValues = obj =>
  Object.entries(obj || {}).reduce((acc, [key, value]) => {
    if (!isEmptyValue(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});

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
  return normalizedPath.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null || key === '') {
      return undefined;
    }
    return acc[key];
  }, object);
};

// Single lookup primitive: first usable value across an ordered list of keys or dotted paths.
const pick = (source, paths) => {
  for (const path of paths) {
    const value = getNestedValue(source, path);
    if (!isEmptyValue(value)) {
      return value;
    }
  }
  return undefined;
};

// Trims per path rather than trimming pick()'s result: a non-scalar at an earlier
// path must be skipped so the remaining paths are still tried, not win and then
// trim away to undefined.
const pickString = (source, paths) => {
  for (const path of paths) {
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

// Null prototype so that a source event named "constructor" or "toString" cannot
// resolve to an inherited Object member instead of a configured mapping row.
const getEventMappingIndex = eventMapping =>
  (Array.isArray(eventMapping) ? eventMapping : []).reduce((acc, row) => {
    const key = normalizeMappingKey(row?.from);
    if (key && !acc[key]) {
      acc[key] = row;
    }
    return acc;
  }, Object.create(null));

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
    return {
      sourceKey,
      mappingRow,
      eventName: customEventName,
      isCustom: true,
      dataType: CUSTOM_EVENT_TYPE,
    };
  }

  if (!STANDARD_EVENT_NAMES.includes(mappedTo)) {
    return { error: LOGGER_MESSAGES.MAPPING_NOT_FOUND(sourceKey) };
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
    .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~\-]/g, '')
    .trim();
  return name || undefined;
};

const normalizeExternalId = value => trimString(value)?.toLowerCase();

// field: pixel payload key. normalize: hash the values after normalizing (PII).
// single: take one scalar instead of a de-duplicated list.
const USER_FIELD_SPECS = [
  {
    field: 'emails_sha256',
    label: 'email',
    normalize: normalizeEmail,
    paths: ['traits.emails', 'context.traits.emails', 'traits.email', 'context.traits.email'],
  },
  {
    field: 'phone_numbers_sha256',
    label: 'phone',
    normalize: normalizePhone,
    paths: [
      'traits.phoneNumbers',
      'context.traits.phoneNumbers',
      'traits.phone_numbers',
      'context.traits.phone_numbers',
      'traits.phones',
      'context.traits.phones',
      'traits.phone',
      'context.traits.phone',
    ],
  },
  {
    field: 'external_ids_sha256',
    label: 'external_id',
    normalize: normalizeExternalId,
    paths: [
      'traits.externalIds',
      'context.traits.externalIds',
      'traits.external_ids',
      'context.traits.external_ids',
      'traits.externalId',
      'context.traits.externalId',
      'traits.external_id',
      'context.traits.external_id',
      'userId',
    ],
  },
  {
    field: 'first_names_sha256',
    label: 'first_name',
    normalize: normalizeName,
    paths: [
      'traits.firstNames',
      'context.traits.firstNames',
      'traits.first_names',
      'context.traits.first_names',
      'traits.firstName',
      'traits.first_name',
      'context.traits.firstName',
      'context.traits.first_name',
    ],
  },
  {
    field: 'last_names_sha256',
    label: 'last_name',
    normalize: normalizeName,
    paths: [
      'traits.lastNames',
      'context.traits.lastNames',
      'traits.last_names',
      'context.traits.last_names',
      'traits.lastName',
      'traits.last_name',
      'context.traits.lastName',
      'context.traits.last_name',
    ],
  },
  {
    field: 'regions',
    paths: ['traits.regions', 'context.traits.regions', 'traits.region', 'context.traits.region'],
  },
  {
    field: 'postal_codes',
    paths: [
      'traits.postalCodes',
      'context.traits.postalCodes',
      'traits.postal_codes',
      'context.traits.postal_codes',
      'traits.postalCode',
      'context.traits.postalCode',
      'traits.postal_code',
      'context.traits.postal_code',
    ],
  },
  {
    field: 'cities',
    paths: [
      'traits.cities',
      'context.traits.cities',
      'traits.address.city',
      'context.traits.address.city',
      'traits.city',
      'context.traits.city',
    ],
  },
  {
    field: 'countries',
    paths: [
      'traits.countries',
      'context.traits.countries',
      'traits.country',
      'context.traits.country',
    ],
  },
  { field: 'obref', single: true, paths: ['traits.obref', 'context.traits.obref'] },
  {
    field: 'android_advertising_id',
    single: true,
    paths: [
      'traits.android_advertising_id',
      'context.traits.android_advertising_id',
      'traits.androidAdvertisingId',
      'context.traits.androidAdvertisingId',
      'context.device.advertisingId',
    ],
  },
  { field: 'ip_address', single: true, paths: ['context.ip', 'request_ip'] },
  { field: 'user_agent', single: true, paths: ['context.userAgent', 'context.user_agent'] },
];

const hashUserValues = (message, { paths, normalize, label }, logger) => {
  const hashed = pickList(message, paths).reduce((acc, value) => {
    const raw = trimString(value);
    if (!raw) {
      return acc;
    }
    if (SHA256_HEX_REGEX.test(raw)) {
      logger?.error(LOGGER_MESSAGES.HASHED_PII_REJECTED(label));
      return acc;
    }
    const normalized = normalize(raw);
    if (normalized) {
      acc.push(sha256(normalized).toString());
    }
    return acc;
  }, []);
  return [...new Set(hashed)];
};

const resolveUserField = (message, spec, logger) => {
  if (spec.single) {
    return pickString(message, spec.paths);
  }
  if (spec.normalize) {
    return hashUserValues(message, spec, logger);
  }
  return [...new Set(pickList(message, spec.paths).map(trimString).filter(Boolean))];
};

const buildUserData = (message = {}, logger) =>
  removeEmptyValues(
    USER_FIELD_SPECS.reduce((user, spec) => {
      user[spec.field] = resolveUserField(message, spec, logger);
      return user;
    }, {}),
  );

const resolveCurrency = (properties, defaultCurrency) => {
  const rawCurrency = trimString(properties?.currency) || trimString(defaultCurrency);
  if (!rawCurrency) {
    return { currency: undefined };
  }

  const currency = normalizeCurrency(rawCurrency);
  if (!currency) {
    return { error: `Unsupported currency code: ${rawCurrency.toUpperCase()}` };
  }

  return { currency };
};

const getPositiveInteger = value => {
  if (isEmptyValue(value)) {
    return undefined;
  }
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const CONTENT_FIELD_SPECS = [
  {
    field: 'id',
    aliases: [
      'id',
      'content_id',
      'contentId',
      'item_id',
      'itemId',
      'product_id',
      'productId',
      'sku',
    ],
  },
  { field: 'name', aliases: ['name', 'title', 'product_name', 'productName'] },
  {
    field: 'content_type',
    aliases: ['content_type', 'contentType', 'type', 'category', 'product_category'],
  },
  { field: 'group_id', aliases: ['group_id', 'groupId'] },
];

const getMappedContentItem = (item, eventCurrency, defaultCurrency) => {
  if (!isPlainObject(item)) {
    return { error: 'invalid content item' };
  }

  const content = CONTENT_FIELD_SPECS.reduce((acc, { field, aliases }) => {
    acc[field] = trimString(pick(item, aliases));
    return acc;
  }, {});

  const variantDict = pick(item, ['variant_dict', 'variantDict']);
  if (isPlainObject(variantDict)) {
    content.variant_dict = variantDict;
  }

  const quantity = getPositiveInteger(pick(item, ['quantity', 'count']));
  if (quantity === null) {
    return { error: 'invalid content item quantity' };
  }
  content.quantity = quantity;

  const itemAmountValue = pick(item, ['amount', 'value', 'price']);
  if (!isEmptyValue(itemAmountValue)) {
    const itemCurrencyResult = resolveCurrency(
      { currency: pick(item, ['currency', 'currency_code', 'currencyCode']) || eventCurrency },
      defaultCurrency,
    );
    if (itemCurrencyResult.error) {
      // Prefixed so an item-level failure is not mistaken for the event-level currency error.
      return { error: `invalid content item currency: ${itemCurrencyResult.error}` };
    }
    const amount = toMinorUnits(itemAmountValue, itemCurrencyResult.currency);
    if (amount === undefined) {
      return { error: 'invalid content item amount' };
    }
    content.amount = amount;
    content.currency = itemCurrencyResult.currency;
  }

  return { content: removeEmptyValues(content) };
};

const buildContents = (properties, defaultCurrency, isCustomEvent) => {
  const contentInput = !isEmptyValue(properties?.contents)
    ? properties.contents
    : properties?.products;
  if (isEmptyValue(contentInput)) {
    return { contents: undefined };
  }

  const eventCurrencyResult = resolveCurrency(properties, defaultCurrency);
  if (eventCurrencyResult.error) {
    return { error: eventCurrencyResult.error };
  }

  const contents = [];
  for (const contentItem of toArray(contentInput)) {
    const mapped = getMappedContentItem(contentItem, eventCurrencyResult.currency, defaultCurrency);
    if (mapped.error) {
      return { error: mapped.error };
    }
    if (!isEmptyValue(mapped.content)) {
      contents.push(mapped.content);
    }
  }

  if (contents.length === 0 && !isCustomEvent) {
    return { error: 'content input did not contain usable fields' };
  }

  return { contents: contents.length > 0 ? contents : undefined };
};

const getActionSource = (properties, defaultActionSource) => {
  const resolved =
    pickString(properties, ['action_source', 'actionSource'])?.toLowerCase() ||
    trimString(defaultActionSource)?.toLowerCase();
  if (!resolved) {
    return { actionSource: undefined };
  }
  if (!ALLOWED_ACTION_SOURCES.includes(resolved)) {
    return { error: `Unsupported OpenAI Ads action_source: ${resolved}` };
  }
  return { actionSource: resolved };
};

const getOptOut = properties => {
  const optOutValue = pick(properties, ['optOut', 'opt_out']);
  if (isEmptyValue(optOutValue)) {
    return { optOut: undefined };
  }
  if (typeof optOutValue !== 'boolean') {
    return { error: 'opt_out must be a boolean' };
  }
  return { optOut: optOutValue };
};

const sanitizeCustomValue = (value, seen = new Set()) => {
  if (isEmptyValue(value)) {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (['string', 'boolean'].includes(typeof value)) {
    return value;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return undefined;
    }
    seen.add(value);
    const sanitizedArray = value
      .map(item => sanitizeCustomValue(item, seen))
      .filter(item => !isEmptyValue(item));
    return sanitizedArray.length > 0 ? sanitizedArray : undefined;
  }
  if (isPlainObject(value)) {
    if (seen.has(value)) {
      return undefined;
    }
    seen.add(value);
    const sanitizedObject = Object.entries(value).reduce((acc, [key, item]) => {
      if (RESERVED_CUSTOM_PROPERTY_KEYS.includes(key)) {
        return acc;
      }
      const sanitizedValue = sanitizeCustomValue(item, seen);
      if (!isEmptyValue(sanitizedValue)) {
        acc[key] = sanitizedValue;
      }
      return acc;
    }, {});
    return Object.keys(sanitizedObject).length > 0 ? sanitizedObject : undefined;
  }
  return undefined;
};

const getCustomProperties = (properties, mappedKeys) =>
  Object.entries(properties || {}).reduce((acc, [key, value]) => {
    if (RESERVED_CUSTOM_PROPERTY_KEYS.includes(key) || mappedKeys.includes(key)) {
      return acc;
    }
    const sanitizedValue = sanitizeCustomValue(value);
    if (!isEmptyValue(sanitizedValue)) {
      acc[key] = sanitizedValue;
    }
    return acc;
  }, {});

const buildEventData = (message, resolvedEvent, config) => {
  const properties = isPlainObject(message?.properties) ? message.properties : {};
  const { dataType, isCustom } = resolvedEvent;

  const actionSourceResult = getActionSource(properties, config?.defaultActionSource);
  if (actionSourceResult.error) {
    return { error: actionSourceResult.error };
  }

  const sourceUrl = pickString(message, [
    'properties.source_url',
    'properties.sourceUrl',
    'context.page.url',
  ]);
  if (actionSourceResult.actionSource === 'web' && !sourceUrl) {
    return { error: 'source_url is required when action_source is web' };
  }

  const optOutResult = getOptOut(properties);
  if (optOutResult.error) {
    return { error: optOutResult.error };
  }

  const currencyResult = resolveCurrency(properties, config?.defaultCurrency);
  if (currencyResult.error) {
    return { error: currencyResult.error };
  }

  // Empty entries are stripped by removeEmptyValues below, so no per-field guards are needed.
  const eventData = {
    type: dataType,
    action_source: actionSourceResult.actionSource,
    source_url: sourceUrl,
    opt_out: optOutResult.optOut,
    oppref: trimString(properties.oppref),
  };

  const amountValue = pick(properties, ['amount', 'value', 'revenue']);
  if (!isEmptyValue(amountValue)) {
    const amount = toMinorUnits(amountValue, currencyResult.currency);
    if (amount === undefined) {
      return { error: 'invalid amount or currency' };
    }
    eventData.amount = amount;
    eventData.currency = currencyResult.currency;
  }

  if (dataType !== 'customer_action') {
    const contentsResult = buildContents(properties, config?.defaultCurrency, isCustom);
    if (contentsResult.error) {
      return { error: contentsResult.error };
    }
    eventData.contents = contentsResult.contents;
  }

  if (isCustom) {
    Object.assign(eventData, getCustomProperties(properties, Object.keys(eventData)));
  }

  return { eventData: removeEmptyValues(eventData) };
};

export {
  buildEventData,
  buildUserData,
  getDeduplicationId,
  getEventMappingIndex,
  removeEmptyValues,
  resolveEvent,
};
