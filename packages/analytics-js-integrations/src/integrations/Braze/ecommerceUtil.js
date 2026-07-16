import { constructPayload } from '../../utils/utils';
import {
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullAndEmptyValues,
} from '../../utils/commonUtils';

/**
 * Braze recommended ecommerce event names.
 * https://www.braze.com/docs/user_guide/data/activation/events/recommended_events
 */
export const BRAZE_ECOMMERCE_EVENTS = {
  PRODUCT_VIEWED: 'ecommerce.product_viewed',
  CART_UPDATED: 'ecommerce.cart_updated',
  CHECKOUT_STARTED: 'ecommerce.checkout_started',
  ORDER_PLACED: 'ecommerce.order_placed',
  ORDER_REFUNDED: 'ecommerce.order_refunded',
  ORDER_CANCELLED: 'ecommerce.order_cancelled',
};

// Braze requires a `source` on every recommended event. This is the web device-mode
// integration, so it always reports `web` — the mobile SDKs report `ios`/`android`.
// A caller-supplied `properties.source` is ignored (and not passed through to metadata).
const BRAZE_WEB_SOURCE = 'web';

// Case-insensitive RS event name -> Braze recommended event mapping.
// Keys are lowercased RS event names. `Cart Viewed` and `Cart Updated` are
// intentionally absent — both fall through to the legacy custom-event path.
const EVENT_NAME_TO_BRAZE = {
  'product viewed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED },
  'product added': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'add' },
  'product removed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'remove' },
  'checkout started': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CHECKOUT_STARTED },
  'order completed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED },
  'order refunded': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED },
  'order cancelled': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_CANCELLED },
};

// The type Braze expects for a recommended-event field. Resolved values are coerced to
// this type where the conversion is safe and lossless; an un-coercible value is sent
// verbatim and surfaced via the type-mismatch warning.
const FIELD_TYPE = {
  STRING: 'string',
  INTEGER: 'integer',
  FLOAT: 'float',
  STRING_ARRAY: 'stringArray',
  ARRAY: 'array',
};

// ---------------------------------------------------------------------------
// Per-event field mappings (mirror of the cloud `Braze*Config.json` files).
// Each entry is built via `mapField(destKey, sourceKeys, required, type)`:
//   - `destKey`/`sourceKeys` are the `constructPayload` contract.
//   - `req` flags Braze-required fields (consumed by collectMissingRequiredFields).
//   - `type` is the Braze-expected type (default String); drives coercion + the
//     type-mismatch warning.
// `sourceKeys` arrays are ordered fallback chains (first resolved value wins).
// ---------------------------------------------------------------------------

const mapField = (destKey, sourceKeys, req = false, type = FIELD_TYPE.STRING) => ({
  destKey,
  sourceKeys,
  req,
  type,
});

// Shared fallback chains reused across checkout/order events.
const TOTAL_VALUE_SOURCES = ['properties.total', 'properties.revenue', 'properties.value'];
const TOTAL_DISCOUNTS_SOURCES = ['properties.discount', 'properties.total_discounts'];

const PRODUCT_VIEWED_MAPPING = [
  mapField('product_id', ['properties.product_id', 'properties.sku'], true),
  mapField('product_name', 'properties.name', true),
  mapField('variant_id', ['properties.variant', 'properties.sku', 'properties.product_id'], true),
  mapField('price', 'properties.price', true, FIELD_TYPE.FLOAT),
  mapField('currency', 'properties.currency', true),
  mapField('image_url', 'properties.image_url'),
  mapField('product_url', 'properties.url'),
  mapField('type', 'properties.type', false, FIELD_TYPE.STRING_ARRAY),
];

const CART_UPDATED_MAPPING = [
  mapField('cart_id', 'properties.cart_id', true),
  mapField('total_value', ['properties.total', 'properties.value'], false, FIELD_TYPE.FLOAT),
  mapField('subtotal_value', 'properties.subtotal_value', false, FIELD_TYPE.FLOAT),
  mapField('tax', 'properties.tax', false, FIELD_TYPE.FLOAT),
  mapField('shipping', 'properties.shipping', false, FIELD_TYPE.FLOAT),
  mapField('currency', 'properties.currency', true),
];

const CHECKOUT_STARTED_MAPPING = [
  mapField('checkout_id', ['properties.checkout_id', 'properties.order_id'], true),
  mapField('cart_id', 'properties.cart_id'),
  mapField('total_value', TOTAL_VALUE_SOURCES, true, FIELD_TYPE.FLOAT),
  mapField('subtotal_value', 'properties.subtotal_value', false, FIELD_TYPE.FLOAT),
  mapField('tax', 'properties.tax', false, FIELD_TYPE.FLOAT),
  mapField('shipping', 'properties.shipping', false, FIELD_TYPE.FLOAT),
  mapField('currency', 'properties.currency', true),
];

const ORDER_PLACED_MAPPING = [
  mapField('order_id', 'properties.order_id', true),
  mapField('total_value', TOTAL_VALUE_SOURCES, true, FIELD_TYPE.FLOAT),
  mapField('currency', 'properties.currency', true),
  mapField('cart_id', 'properties.cart_id'),
  mapField('tax', 'properties.tax', false, FIELD_TYPE.FLOAT),
  mapField('shipping', 'properties.shipping', false, FIELD_TYPE.FLOAT),
  mapField('total_discounts', TOTAL_DISCOUNTS_SOURCES, false, FIELD_TYPE.FLOAT),
  mapField('subtotal_value', 'properties.subtotal_value', false, FIELD_TYPE.FLOAT),
  mapField('discounts', 'properties.discounts', false, FIELD_TYPE.ARRAY),
];

const ORDER_REFUNDED_MAPPING = [
  mapField('order_id', 'properties.order_id', true),
  mapField('total_value', TOTAL_VALUE_SOURCES, true, FIELD_TYPE.FLOAT),
  mapField('currency', 'properties.currency', true),
  mapField('total_discounts', TOTAL_DISCOUNTS_SOURCES, false, FIELD_TYPE.FLOAT),
  mapField('discounts', 'properties.discounts', false, FIELD_TYPE.ARRAY),
];

const ORDER_CANCELLED_MAPPING = [
  mapField('order_id', 'properties.order_id', true),
  mapField('total_value', TOTAL_VALUE_SOURCES, true, FIELD_TYPE.FLOAT),
  mapField('currency', 'properties.currency', true),
  mapField('cancel_reason', ['properties.cancel_reason', 'properties.reason'], true),
  mapField('tax', 'properties.tax', false, FIELD_TYPE.FLOAT),
  mapField('shipping', 'properties.shipping', false, FIELD_TYPE.FLOAT),
  mapField('total_discounts', TOTAL_DISCOUNTS_SOURCES, false, FIELD_TYPE.FLOAT),
  mapField('subtotal_value', 'properties.subtotal_value', false, FIELD_TYPE.FLOAT),
  mapField('discounts', 'properties.discounts', false, FIELD_TYPE.ARRAY),
];

// Shared per-product mapping (bare keys — read from each `products[i]` /
// `properties` directly, no `properties.` prefix).
const ECOMMERCE_PRODUCT_MAPPING = [
  mapField('product_id', ['product_id', 'sku'], true),
  mapField('product_name', 'name', true),
  mapField('variant_id', ['variant', 'sku', 'product_id'], true),
  mapField('quantity', 'quantity', true, FIELD_TYPE.INTEGER),
  mapField('price', 'price', true, FIELD_TYPE.FLOAT),
  mapField('image_url', 'image_url'),
  mapField('product_url', 'url'),
];

const PER_EVENT_MAPPING = {
  [BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED]: PRODUCT_VIEWED_MAPPING,
  [BRAZE_ECOMMERCE_EVENTS.CART_UPDATED]: CART_UPDATED_MAPPING,
  [BRAZE_ECOMMERCE_EVENTS.CHECKOUT_STARTED]: CHECKOUT_STARTED_MAPPING,
  [BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED]: ORDER_PLACED_MAPPING,
  [BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED]: ORDER_REFUNDED_MAPPING,
  [BRAZE_ECOMMERCE_EVENTS.ORDER_CANCELLED]: ORDER_CANCELLED_MAPPING,
};

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * A field counts as "resolved" iff it survives the outgoing payload scrub
 * (`removeUndefinedAndNullAndEmptyValues`). Reuse that exact predicate so the
 * missing-required-field warning can never drift from what's actually sent — e.g. a
 * required field of `{}`/`[]`/`''` is both stripped from the payload AND warned, while
 * `0`/`false`/numbers stay valid.
 */
const isResolvedValue = isDefinedAndNotNullAndNotEmpty;

// A safe, lossless numeric-string conversion accepts only plain decimal literals (no
// scientific notation, Infinity, or NaN). Integer additionally forbids a fractional part.
const FLOAT_STRING_REGEX = /^[+-]?(\d+\.?\d*|\.\d+)$/;
const INTEGER_STRING_REGEX = /^[+-]?\d+$/;

/**
 * Whether `value` is a real, finite number. `Infinity`/`-Infinity` are excluded because they
 * are not JSON-serializable (they become `null`), so they must never be treated as a valid
 * numeric value nor be produced by a coercion. (`Number.isFinite` is unavailable on the
 * legacy build targets, hence the explicit check.)
 */
const isFiniteNumber = value =>
  typeof value === 'number' && !Number.isNaN(value) && value !== Infinity && value !== -Infinity;

/**
 * Parse a numeric string to a number, but only commit the conversion when it is lossless —
 * an overflowing literal (e.g. a 400-digit number) would land on `Infinity`, so it is left
 * verbatim for the type-mismatch warning instead of being destroyed.
 */
const coerceNumericString = (value, regex) => {
  const trimmed = value.trim();
  if (!regex.test(trimmed)) {
    return value;
  }
  const num = Number(trimmed);
  return isFiniteNumber(num) ? num : value;
};

/**
 * Coerce a resolved primitive to the type Braze expects, when the conversion is safe and
 * lossless; otherwise return it unchanged (the residual mismatch is surfaced by the
 * type-mismatch warning). Mirrors the cloud coercion table:
 *   - numeric string  -> float    (`"29.99"` -> `29.99`)
 *   - integer string  -> integer  (`"2"` -> `2`; `"2.5"`/`"2.0"` left as-is)
 *   - number          -> string   (`12345` -> `"12345"`)
 * Integer numbers are left as-is for float fields (Braze accepts an int where a float is
 * expected, and JSON cannot express `2.0`). Booleans are NOT coerced to string, and
 * arrays/objects are never coerced.
 */
const coerceValue = (value, type) => {
  if (value === null || typeof value === 'object') {
    return value;
  }
  switch (type) {
    case FIELD_TYPE.STRING:
      return typeof value === 'number' ? String(value) : value;
    case FIELD_TYPE.FLOAT:
      return typeof value === 'string' ? coerceNumericString(value, FLOAT_STRING_REGEX) : value;
    case FIELD_TYPE.INTEGER:
      // Only a pure integer literal is a safe, lossless conversion ("2", not "2.5"/"2.0").
      return typeof value === 'string' ? coerceNumericString(value, INTEGER_STRING_REGEX) : value;
    default:
      // stringArray / array — never coerced.
      return value;
  }
};

/**
 * Whether `value` already matches the type Braze expects. A numeric written as a string
 * (e.g. `"29.99"`) does NOT match a numeric type, so an un-coercible value still warns.
 * `0`/`false` are valid for their respective types; `NaN`/`Infinity` are not.
 */
const matchesType = (value, type) => {
  switch (type) {
    case FIELD_TYPE.STRING:
      return typeof value === 'string';
    case FIELD_TYPE.INTEGER:
      // `value % 1 === 0` is true only for whole numbers.
      return isFiniteNumber(value) && value % 1 === 0;
    case FIELD_TYPE.FLOAT:
      return isFiniteNumber(value);
    case FIELD_TYPE.STRING_ARRAY:
      return Array.isArray(value) && value.every(item => typeof item === 'string');
    case FIELD_TYPE.ARRAY:
      return Array.isArray(value);
    default:
      return true;
  }
};

/**
 * Coerce every mapped field present in `obj` to its Braze-expected type, in place.
 * Returns `obj` for chaining.
 */
const coerceMappedFields = (obj, mapping) => {
  mapping.forEach(entry => {
    if (entry.destKey in obj) {
      obj[entry.destKey] = coerceValue(obj[entry.destKey], entry.type);
    }
  });
  return obj;
};

/**
 * Return the subset of `source` whose keys are not in `consumed`, with undefined/null/empty
 * values scrubbed out. Used to derive the `metadata` pass-through — the top-level
 * `removeUndefinedAndNullAndEmptyValues` is shallow, so this is the only place nested
 * metadata gets cleaned.
 */
const pickUnmappedKeys = (source, consumed) => {
  const result = {};
  Object.keys(source).forEach(key => {
    if (!consumed.has(key)) {
      result[key] = source[key];
    }
  });
  return removeUndefinedAndNullAndEmptyValues(result);
};

/**
 * Compute the set of source keys referenced by a per-product mapping. Product mappings
 * use bare keys (`product_id`, `name`, ...), so no prefix-stripping is required.
 */
const consumedKeysFromMapping = mapping => {
  const consumed = new Set();
  mapping.forEach(entry => {
    const sources = Array.isArray(entry.sourceKeys) ? entry.sourceKeys : [entry.sourceKeys];
    sources.forEach(src => {
      if (typeof src === 'string') {
        consumed.add(src);
      }
    });
  });
  return consumed;
};

/**
 * Compute the set of message-property keys "consumed" by the event-level mapping (so
 * they aren't duplicated into `metadata`). Includes the `properties.`-prefixed source
 * keys, the `source` key (always derived), the `products` key for product-bearing
 * events, and (for cart_updated without an explicit `products[]`) the top-level product
 * field keys folded into products[0].
 */
const consumedTopLevelKeysForEvent = (brazeEvent, eventMapping, hasProducts, properties) => {
  const consumed = new Set();
  consumed.add('source');

  eventMapping.forEach(entry => {
    const sources = Array.isArray(entry.sourceKeys) ? entry.sourceKeys : [entry.sourceKeys];
    sources.forEach(src => {
      if (typeof src === 'string' && src.startsWith('properties.')) {
        consumed.add(src.slice('properties.'.length));
      }
    });
  });

  if (hasProducts) {
    consumed.add('products');
  }

  // cart_updated wraps top-level product fields into a single product ONLY when no
  // explicit `products[]` is provided; in that case mark those keys as consumed so they
  // don't duplicate into event-level metadata. When `products[]` is present, the top-level
  // fields are untouched and must flow through to metadata.
  if (brazeEvent === BRAZE_ECOMMERCE_EVENTS.CART_UPDATED && !Array.isArray(properties.products)) {
    consumedKeysFromMapping(ECOMMERCE_PRODUCT_MAPPING).forEach(key => consumed.add(key));
  }

  return consumed;
};

/**
 * Build the `products[]` array for the outgoing payload.
 * - cart_updated WITHOUT an explicit `products[]`: read top-level product fields directly
 *   from `properties` into a 1-element products[]. No per-product metadata — unmapped
 *   event-level keys flow through the event-level metadata pass.
 * - all other cases (cart_updated WITH `products[]`, and other product-bearing events):
 *   map each item in `properties.products` and route per-product unmapped keys to
 *   `products[i].metadata`.
 */
const buildProductsArray = (properties, brazeEvent) => {
  const isCartUpdated = brazeEvent === BRAZE_ECOMMERCE_EVENTS.CART_UPDATED;

  if (isCartUpdated && !Array.isArray(properties.products)) {
    const product = removeUndefinedAndNullAndEmptyValues(
      coerceMappedFields(
        constructPayload(properties, ECOMMERCE_PRODUCT_MAPPING) || {},
        ECOMMERCE_PRODUCT_MAPPING,
      ),
    );
    return Object.keys(product).length > 0 ? [product] : [];
  }

  const rawProducts = Array.isArray(properties.products) ? properties.products : [];
  const consumedKeys = consumedKeysFromMapping(ECOMMERCE_PRODUCT_MAPPING);
  return rawProducts
    .map(raw => {
      const item = raw && typeof raw === 'object' ? raw : {};
      const product = removeUndefinedAndNullAndEmptyValues(
        coerceMappedFields(
          constructPayload(item, ECOMMERCE_PRODUCT_MAPPING) || {},
          ECOMMERCE_PRODUCT_MAPPING,
        ),
      );
      const productMetadata = pickUnmappedKeys(item, consumedKeys);
      if (Object.keys(productMetadata).length > 0) {
        product.metadata = productMetadata;
      }
      return product;
    })
    .filter(product => Object.keys(product).length > 0);
};

/**
 * Collect the Braze-required fields missing from the constructed payload — event-level
 * and per-product. An empty `products[]` on a product-bearing event is reported as a
 * missing `products` field. Returns a flat list of human-readable field labels.
 */
const collectMissingRequiredFields = (eventMapping, hasProducts, payload) => {
  const missing = [];

  eventMapping.forEach(entry => {
    if (entry.req && !isResolvedValue(payload[entry.destKey])) {
      missing.push(entry.destKey);
    }
  });

  if (hasProducts) {
    const products = Array.isArray(payload.products) ? payload.products : [];
    if (products.length === 0) {
      missing.push('products');
    } else {
      const missingProductFields = new Set();
      products.forEach(product => {
        ECOMMERCE_PRODUCT_MAPPING.forEach(entry => {
          if (entry.req && !isResolvedValue(product[entry.destKey])) {
            missingProductFields.add(`products.${entry.destKey}`);
          }
        });
      });
      missingProductFields.forEach(field => missing.push(field));
    }
  }

  return missing;
};

/**
 * Whether a resolved value is present but doesn't match its Braze-expected type. Only
 * resolved values are flagged — an empty/missing value is scrubbed before send and is the
 * missing-required warning's job, so it must not double-warn here.
 */
const isTypeMismatch = (value, type) => isResolvedValue(value) && !matchesType(value, type);

/**
 * Collect the mapped fields whose (already-coerced) value is present but still doesn't
 * match Braze's expected type — event-level and per-product. Returns labels of the form
 * `destKey (expected <type>)` / `products.destKey (expected <type>)`.
 */
const collectTypeMismatchedFields = (eventMapping, hasProducts, payload) => {
  const mismatched = [];

  eventMapping.forEach(entry => {
    if (isTypeMismatch(payload[entry.destKey], entry.type)) {
      mismatched.push(`${entry.destKey} (expected ${entry.type})`);
    }
  });

  if (hasProducts) {
    const products = Array.isArray(payload.products) ? payload.products : [];
    const mismatchedProductFields = new Set();
    products.forEach(product => {
      ECOMMERCE_PRODUCT_MAPPING.forEach(entry => {
        if (isTypeMismatch(product[entry.destKey], entry.type)) {
          mismatchedProductFields.add(`products.${entry.destKey} (expected ${entry.type})`);
        }
      });
    });
    mismatchedProductFields.forEach(field => mismatched.push(field));
  }

  return mismatched;
};

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

/**
 * Resolve the Braze recommended event for a given RS event name.
 * Returns `undefined` for unmapped events — caller falls back to the legacy path.
 * Matching is case-insensitive on the trimmed event name.
 */
export const getEcommerceMapping = eventName => {
  if (typeof eventName !== 'string') {
    return undefined;
  }
  return EVENT_NAME_TO_BRAZE[eventName.trim().toLowerCase()];
};

/**
 * Build the `properties` object for a Braze recommended ecommerce event.
 *
 * Algorithm:
 * 1. Run `constructPayload` against the message event-level mapping (never throws —
 *    send-anyway is enforced via the validation warning instead).
 * 2. For events with a `products[]`, build the array (single-product wrap for
 *    `cart_updated` without an explicit `products[]`, iterate `properties.products`
 *    otherwise).
 * 3. Set `source` (always `web` on this SDK) and `action` when present.
 * 4. Route unmapped event-level keys to `properties.metadata` (excluding `action`, which is
 *    set explicitly), and unmapped per-product keys to `products[].metadata`.
 * 5. Emit a single `logger.warn` listing any missing Braze-required fields.
 * 6. Emit a single `logger.warn` listing any field whose value type doesn't match Braze's
 *    schema after safe coercion (Braze rejects type-mismatched events; the value is sent
 *    as-is so it's not silently dropped).
 *
 * Never throws on data shape; the warnings + the (still-sent) payload are the contract.
 */
export const buildEcommerceEventProperties = (message, brazeEvent, action, logger) => {
  const properties = message.properties || {};
  const eventMapping = PER_EVENT_MAPPING[brazeEvent] || [];
  const hasProducts = brazeEvent !== BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED;

  // Step 1: event-level field mapping, with each mapped value coerced to its Braze type.
  const payload = coerceMappedFields(constructPayload(message, eventMapping) || {}, eventMapping);

  // Step 2: products[] (skipped for product_viewed — flat, single-product event).
  if (hasProducts) {
    payload.products = buildProductsArray(properties, brazeEvent);
  }

  // Step 3: source + action.
  payload.source = BRAZE_WEB_SOURCE;
  if (action) {
    payload.action = action;
  }

  // Step 4: route unmapped event-level keys to metadata. Exclude `action` when it's set
  // explicitly (Step 3) so a caller-provided `properties.action` can't conflict with it.
  const consumedEventKeys = consumedTopLevelKeysForEvent(
    brazeEvent,
    eventMapping,
    hasProducts,
    properties,
  );
  if (action) {
    consumedEventKeys.add('action');
  }
  const eventMetadata = pickUnmappedKeys(properties, consumedEventKeys);
  if (Object.keys(eventMetadata).length > 0) {
    payload.metadata = eventMetadata;
  }

  // Step 5: single warning for any missing Braze-required field.
  const missingFields = collectMissingRequiredFields(eventMapping, hasProducts, payload);
  if (missingFields.length > 0 && logger) {
    logger.warn(
      `${brazeEvent}: missing recommended Braze-required field(s): ${missingFields.join(', ')}. Event sent anyway.`,
    );
  }

  // Step 6: single warning for any field whose type still doesn't match Braze's schema.
  const mismatchedFields = collectTypeMismatchedFields(eventMapping, hasProducts, payload);
  if (mismatchedFields.length > 0 && logger) {
    logger.warn(
      `${brazeEvent}: type-mismatched field(s) (sent as-is): ${mismatchedFields.join(', ')}.`,
    );
  }

  return removeUndefinedAndNullAndEmptyValues(payload);
};
