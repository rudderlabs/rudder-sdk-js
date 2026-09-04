import sha256 from 'crypto-js/sha256';
import { normalizeCurrency, toMinorUnits } from './currency';
import {
  ALLOWED_ACTION_SOURCES,
  COOKIE_OBREF,
  CUSTOM_EVENT_TYPE,
  EVENT_DATA_SHAPES,
  LOGGER_MESSAGES,
  PIXEL_UNSUPPORTED_EVENTS,
  RESERVED_CUSTOM_PROPERTY_KEYS,
  STANDARD_EVENT_NAMES,
} from './constants';

const SHA256_HEX_REGEX = /^[\da-f]{64}$/i;
const EMAIL_REGEX = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;

const isPlainObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

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

const getFirstUsableValue = (source, keys) => {
  if (!source) {
    return undefined;
  }
  for (const key of keys) {
    const value = source[key];
    if (!isEmptyValue(value)) {
      return value;
    }
  }
  return undefined;
};

const toArray = value => (Array.isArray(value) ? value : [value]);

const normalizeList = value => {
  if (isEmptyValue(value)) {
    return [];
  }
  return toArray(value)
    .map(trimString)
    .filter(Boolean);
};

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

const normalizeMappingKey = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const getEventMappingIndex = eventMapping =>
  (Array.isArray(eventMapping) ? eventMapping : []).reduce((acc, row) => {
    const key = normalizeMappingKey(row?.from);
    if (key && !acc[key]) {
      acc[key] = row;
    }
    return acc;
  }, {});

const resolvePixelId = config => trimString(config?.pixelId);

const resolveEvent = (message, messageType, eventMapping) => {
  const sourceKey = messageType === 'track' ? trimString(message?.event) : trimString(message?.name);
  if (!sourceKey) {
    return { error: LOGGER_MESSAGES.MISSING_SOURCE_KEY };
  }

  const mappingRow = getEventMappingIndex(eventMapping)[normalizeMappingKey(sourceKey)];
  let eventType;
  let eventName;
  let isCustom = false;

  if (mappingRow) {
    const mappedTo = trimString(mappingRow.to);
    if (mappedTo === CUSTOM_EVENT_TYPE) {
      const customEventName = trimString(mappingRow.customEventName);
      if (!customEventName) {
        return { error: LOGGER_MESSAGES.CUSTOM_MAPPING_MISSING_NAME };
      }
      eventType = CUSTOM_EVENT_TYPE;
      eventName = customEventName;
      isCustom = true;
    } else if (STANDARD_EVENT_NAMES.includes(mappedTo)) {
      eventType = mappedTo;
      eventName = mappedTo;
    } else {
      return { error: LOGGER_MESSAGES.MAPPING_NOT_FOUND(sourceKey) };
    }
  } else {
    return { error: LOGGER_MESSAGES.MAPPING_NOT_FOUND(sourceKey) };
  }

  if (PIXEL_UNSUPPORTED_EVENTS.includes(eventType)) {
    return { error: LOGGER_MESSAGES.UNSUPPORTED_PIXEL_EVENT(eventType) };
  }

  return {
    sourceKey,
    mappingRow,
    eventType,
    eventName,
    isCustom,
    dataType: isCustom ? CUSTOM_EVENT_TYPE : EVENT_DATA_SHAPES[eventType],
  };
};

const isEventFiltered = (sourceKey, config) => {
  const option = config?.eventFilteringOption?.web;
  if (!option || option === 'disable') {
    return false;
  }

  const eventList =
    option === 'whitelistedEvents' ? config?.whitelistedEvents?.web : config?.blacklistedEvents?.web;
  const configuredEvents = (Array.isArray(eventList) ? eventList : [])
    .map(item => normalizeMappingKey(item?.eventName))
    .filter(Boolean);
  const normalizedSourceKey = normalizeMappingKey(sourceKey);

  if (option === 'whitelistedEvents') {
    return !configuredEvents.includes(normalizedSourceKey);
  }
  if (option === 'blacklistedEvents') {
    return configuredEvents.includes(normalizedSourceKey);
  }
  return false;
};

const getDeduplicationId = (message, mappingRow) => {
  const deduplicationKey = trimString(mappingRow?.deduplicationKey);
  if (deduplicationKey) {
    const configuredValue = getNestedValue(message, deduplicationKey);
    if (!isEmptyValue(configuredValue)) {
      if (!isScalar(configuredValue)) {
        return {
          error: `OpenAI Ads deduplication key "${deduplicationKey}" must resolve to a string`,
        };
      }
      return { id: trimString(configuredValue) };
    }
  }
  return { id: trimString(message?.messageId) };
};

const hashNormalized = value => sha256(value).toString();

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

const collectValuesFromPaths = (message, paths) => {
  for (const path of paths) {
    const value = getNestedValue(message, path);
    if (!isEmptyValue(value)) {
      return toArray(value);
    }
  }
  return [];
};

const collectFirstRawValue = (message, paths) => {
  for (const path of paths) {
    const value = trimString(getNestedValue(message, path));
    if (value) {
      return value;
    }
  }
  return undefined;
};

const normalizeAndHashValues = (message, paths, normalizer, fieldName, logger) => {
  const values = collectValuesFromPaths(message, paths);
  const hashedValues = [];

  values.forEach(value => {
    const raw = trimString(value);
    if (!raw) {
      return;
    }
    if (SHA256_HEX_REGEX.test(raw)) {
      logger?.error(LOGGER_MESSAGES.HASHED_PII_REJECTED(fieldName));
      return;
    }
    const normalized = normalizer(raw);
    if (normalized) {
      hashedValues.push(hashNormalized(normalized));
    }
  });

  return [...new Set(hashedValues)];
};

const normalizeRawArrayValues = (message, paths) => {
  const values = collectValuesFromPaths(message, paths);
  return [...new Set(normalizeList(values))];
};

const isValidIpAddress = value => {
  if (!value) {
    return false;
  }
  const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  const ipv6 = /^[\d:A-Fa-f]+$/;
  return ipv4.test(value) || (value.includes(':') && ipv6.test(value));
};

const buildUserData = (message = {}, logger, extraUserData = {}) => {
  const user = {};

  const emails = normalizeAndHashValues(
    message,
    ['traits.emails', 'context.traits.emails', 'traits.email', 'context.traits.email'],
    normalizeEmail,
    'email',
    logger,
  );
  if (emails.length > 0) {
    user.emails_sha256 = emails;
  }

  const phones = normalizeAndHashValues(
    message,
    [
      'traits.phoneNumbers',
      'context.traits.phoneNumbers',
      'traits.phone_numbers',
      'context.traits.phone_numbers',
      'traits.phones',
      'context.traits.phones',
      'traits.phone',
      'context.traits.phone',
    ],
    normalizePhone,
    'phone',
    logger,
  );
  if (phones.length > 0) {
    user.phone_numbers_sha256 = phones;
  }

  const externalIds = normalizeAndHashValues(
    message,
    [
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
    normalizeExternalId,
    'external_id',
    logger,
  );
  if (externalIds.length > 0) {
    user.external_ids_sha256 = externalIds;
  }

  const firstNames = normalizeAndHashValues(
    message,
    [
      'traits.firstNames',
      'context.traits.firstNames',
      'traits.first_names',
      'context.traits.first_names',
      'traits.firstName',
      'context.traits.firstName',
      'traits.first_name',
      'context.traits.first_name',
    ],
    normalizeName,
    'first_name',
    logger,
  );
  if (firstNames.length > 0) {
    user.first_names_sha256 = firstNames;
  }

  const lastNames = normalizeAndHashValues(
    message,
    [
      'traits.lastNames',
      'context.traits.lastNames',
      'traits.last_names',
      'context.traits.last_names',
      'traits.lastName',
      'context.traits.lastName',
      'traits.last_name',
      'context.traits.last_name',
    ],
    normalizeName,
    'last_name',
    logger,
  );
  if (lastNames.length > 0) {
    user.last_names_sha256 = lastNames;
  }

  const rawArrayMappings = [
    {
      field: 'regions',
      paths: [
        'traits.regions',
        'context.traits.regions',
        'traits.region',
        'context.traits.region',
        'traits.states',
        'context.traits.states',
        'traits.state',
        'context.traits.state',
      ],
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
        'traits.zips',
        'context.traits.zips',
        'traits.zip',
        'context.traits.zip',
      ],
    },
    {
      field: 'cities',
      paths: ['traits.cities', 'context.traits.cities', 'traits.city', 'context.traits.city'],
    },
    {
      field: 'countries',
      paths: [
        'traits.countries',
        'context.traits.countries',
        'traits.country',
        'context.traits.country',
        'traits.countryCodes',
        'context.traits.countryCodes',
        'traits.countryCode',
        'context.traits.countryCode',
      ],
    },
  ];

  rawArrayMappings.forEach(({ field, paths }) => {
    const values = normalizeRawArrayValues(message, paths);
    if (values.length > 0) {
      user[field] = values;
    }
  });

  const obref =
    collectFirstRawValue(message, ['traits.obref', 'context.traits.obref']) ||
    trimString(extraUserData.obref);
  if (obref) {
    user.obref = obref;
  }

  const androidAdvertisingId = collectFirstRawValue(message, [
    'traits.android_advertising_id',
    'context.traits.android_advertising_id',
    'traits.androidAdvertisingId',
    'context.traits.androidAdvertisingId',
    'context.device.advertisingId',
  ]);
  if (androidAdvertisingId) {
    user.android_advertising_id = androidAdvertisingId;
  }

  const ipAddress = collectFirstRawValue(message, ['context.ip', 'request_ip']);
  if (isValidIpAddress(ipAddress)) {
    user.ip_address = ipAddress;
  }

  const userAgent = collectFirstRawValue(message, ['context.userAgent', 'context.user_agent']);
  if (userAgent) {
    user.user_agent = userAgent;
  }

  return removeEmptyValues(user);
};

const getCookieValue = cookieName => {
  if (typeof document === 'undefined' || typeof document.cookie !== 'string') {
    return undefined;
  }

  const cookie = document.cookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${cookieName}=`));

  if (!cookie) {
    return undefined;
  }

  const value = cookie.slice(cookieName.length + 1);
  try {
    return decodeURIComponent(value);
  } catch (_) {
    return value;
  }
};

const getObrefFromCookie = () => trimString(getCookieValue(COOKIE_OBREF));

const getAmountValue = properties => {
  if (!properties) {
    return undefined;
  }
  if (!isEmptyValue(properties.amount)) {
    return properties.amount;
  }
  if (!isEmptyValue(properties.value)) {
    return properties.value;
  }
  if (!isEmptyValue(properties.revenue)) {
    return properties.revenue;
  }
  return undefined;
};

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

const getMappedContentItem = (item, eventCurrency, defaultCurrency) => {
  if (!isPlainObject(item)) {
    return { invalid: true };
  }

  const content = {};
  const id = trimString(
    getFirstUsableValue(item, [
      'id',
      'content_id',
      'contentId',
      'item_id',
      'itemId',
      'product_id',
      'productId',
      'sku',
    ]),
  );
  if (id) {
    content.id = id;
  }

  const name = trimString(getFirstUsableValue(item, ['name', 'title', 'product_name', 'productName']));
  if (name) {
    content.name = name;
  }

  const contentType = trimString(
    getFirstUsableValue(item, [
      'content_type',
      'contentType',
      'type',
      'category',
      'product_category',
    ]),
  );
  if (contentType) {
    content.content_type = contentType;
  }

  const groupId = trimString(getFirstUsableValue(item, ['group_id', 'groupId']));
  if (groupId) {
    content.group_id = groupId;
  }

  const variantDict = getFirstUsableValue(item, ['variant_dict', 'variantDict']);
  if (isPlainObject(variantDict)) {
    content.variant_dict = variantDict;
  }

  const quantityValue = getFirstUsableValue(item, ['quantity', 'count']);
  const quantity = getPositiveInteger(quantityValue);
  if (quantity === null) {
    return { invalid: true };
  }
  if (quantity !== undefined) {
    content.quantity = quantity;
  }

  const itemAmountValue = getFirstUsableValue(item, ['amount', 'value', 'price']);
  if (!isEmptyValue(itemAmountValue)) {
    const itemCurrencyResult = resolveCurrency(
      {
        currency:
          getFirstUsableValue(item, ['currency', 'currency_code', 'currencyCode']) ||
          eventCurrency,
      },
      defaultCurrency,
    );
    if (itemCurrencyResult.error) {
      return { invalid: true };
    }
    const itemCurrency = itemCurrencyResult.currency;
    const amount = toMinorUnits(itemAmountValue, itemCurrency);
    if (amount === undefined) {
      return { invalid: true };
    }
    content.amount = amount;
    content.currency = itemCurrency;
  }

  return { content: removeEmptyValues(content) };
};

const buildContents = (properties, defaultCurrency, isCustomEvent) => {
  const contentInput = !isEmptyValue(properties?.contents) ? properties.contents : properties?.products;
  if (isEmptyValue(contentInput)) {
    return { contents: undefined };
  }

  const contentItems = Array.isArray(contentInput) ? contentInput : [contentInput];
  if (!contentItems.every(isPlainObject)) {
    return { error: 'invalid content item' };
  }

  const eventCurrencyResult = resolveCurrency(properties, defaultCurrency);
  if (eventCurrencyResult.error) {
    return { error: eventCurrencyResult.error };
  }
  const eventCurrency = eventCurrencyResult.currency;
  const contents = [];
  for (const contentItem of contentItems) {
    const mapped = getMappedContentItem(contentItem, eventCurrency, defaultCurrency);
    if (mapped.invalid) {
      return { error: 'invalid content item' };
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
  const actionSource =
    trimString(properties?.action_source)?.toLowerCase() ||
    trimString(properties?.actionSource)?.toLowerCase();
  const resolved = actionSource || trimString(defaultActionSource);
  if (!resolved) {
    return { actionSource: undefined };
  }
  if (!ALLOWED_ACTION_SOURCES.includes(resolved)) {
    return { error: `Unsupported OpenAI Ads action_source: ${resolved}` };
  }
  return { actionSource: resolved };
};

const getSourceUrl = message => {
  return (
    trimString(message?.properties?.source_url) ||
    trimString(message?.properties?.sourceUrl) ||
    trimString(message?.context?.page?.url)
  );
};

const getOptOut = properties => {
  const optOutValue = !isEmptyValue(properties?.optOut) ? properties.optOut : properties?.opt_out;
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

const getCustomProperties = (properties, explicitKeys) =>
  Object.entries(properties || {}).reduce((acc, [key, value]) => {
    if (
      RESERVED_CUSTOM_PROPERTY_KEYS.includes(key) ||
      explicitKeys.includes(key)
    ) {
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
  const eventData = { type: dataType };
  const explicitKeys = ['type'];

  const actionSourceResult = getActionSource(properties, config?.defaultActionSource);
  if (actionSourceResult.error) {
    return { error: actionSourceResult.error };
  }
  const actionSource = actionSourceResult.actionSource;
  if (actionSource) {
    eventData.action_source = actionSource;
    explicitKeys.push('action_source');
  }

  const sourceUrl = getSourceUrl(message);
  if (actionSource === 'web' && !sourceUrl) {
    return { error: 'source_url is required when action_source is web' };
  }
  if (sourceUrl) {
    eventData.source_url = sourceUrl;
    explicitKeys.push('source_url');
  }

  const optOutResult = getOptOut(properties);
  if (optOutResult.error) {
    return { error: optOutResult.error };
  }
  if (optOutResult.optOut !== undefined) {
    eventData.opt_out = optOutResult.optOut;
    explicitKeys.push('opt_out');
  }

  const oppref = trimString(properties.oppref);
  if (oppref) {
    eventData.oppref = oppref;
    explicitKeys.push('oppref');
  }

  const currencyResult = resolveCurrency(properties, config?.defaultCurrency);
  if (currencyResult.error) {
    return { error: currencyResult.error };
  }
  const currency = currencyResult.currency;

  const amountValue = getAmountValue(properties);
  if (!isEmptyValue(amountValue)) {
    const amount = toMinorUnits(amountValue, currency);
    if (amount === undefined) {
      return { error: 'invalid amount or currency' };
    }
    eventData.amount = amount;
    eventData.currency = currency;
    explicitKeys.push('amount');
    explicitKeys.push('currency');
  }

  if (dataType !== 'customer_action') {
    const contentsResult = buildContents(properties, config?.defaultCurrency, isCustom);
    if (contentsResult.error) {
      return { error: contentsResult.error };
    }
    if (contentsResult.contents) {
      eventData.contents = contentsResult.contents;
      explicitKeys.push('contents');
    }
  }

  if (isCustom) {
    Object.assign(eventData, getCustomProperties(properties, explicitKeys));
  }

  return { eventData: removeEmptyValues(eventData) };
};

export {
  buildEventData,
  buildUserData,
  getDeduplicationId,
  getObrefFromCookie,
  isEventFiltered,
  removeEmptyValues,
  resolveEvent,
  resolvePixelId,
};
