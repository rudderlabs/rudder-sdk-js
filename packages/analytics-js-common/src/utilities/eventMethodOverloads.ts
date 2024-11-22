import { clone } from 'ramda';
import type { ApiObject } from '../types/ApiObject';
import type { ApiCallback, ApiOptions } from '../types/EventApi';
import type { Nullable } from '../types/Nullable';
import { getSanitizedValue, isObjectLiteralAndNotNull, mergeDeepRight } from './object';
import { isDefined, isDefinedAndNotNull, isFunction, isNull, isString } from './checks';
import { tryStringify } from './string';
import type { IdentifyTraits } from '../types/traits';

export type PageCallOptions = {
  category?: string;
  name?: string;
  properties?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

export type TrackCallOptions = {
  name: string;
  properties?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

export type IdentifyCallOptions = {
  userId?: Nullable<string>;
  traits?: Nullable<IdentifyTraits>;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

export type AliasCallOptions = {
  to: string;
  from?: string;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

export type GroupCallOptions = {
  groupId?: Nullable<string>;
  traits?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

// TODO: is there any specific reason why we set the overloaded values to null instead of undefined?
//   if yes make them null instead of omitting in overloaded cases

/*
 * Normalise the overloaded arguments of the page call facade
 */
const pageArgumentsToCallOptions = (
  category?: string | Nullable<ApiObject> | ApiCallback,
  name?: string | Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
  properties?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): PageCallOptions => {
  const sanitizedCategory = getSanitizedValue(category);
  const sanitizedName = getSanitizedValue(name);
  const sanitizedProperties = getSanitizedValue(properties);
  const sanitizedOptions = getSanitizedValue(options);
  const sanitizedCallback = getSanitizedValue(callback);

  const payload: PageCallOptions = {
    category: sanitizedCategory as string,
    name: sanitizedName as string,
    properties: sanitizedProperties as Nullable<ApiObject>,
    options: sanitizedOptions as Nullable<ApiOptions>,
    callback: undefined,
  };

  if (isFunction(sanitizedCallback)) {
    payload.callback = sanitizedCallback;
  }

  if (isFunction(sanitizedOptions)) {
    payload.category = sanitizedCategory as string;
    payload.name = sanitizedName as string;
    payload.properties = sanitizedProperties as Nullable<ApiObject>;
    payload.options = undefined;
    payload.callback = sanitizedOptions;
  }

  if (isFunction(sanitizedProperties)) {
    payload.category = sanitizedCategory as string;
    payload.name = sanitizedName as string;
    payload.properties = undefined;
    payload.options = undefined;
    payload.callback = sanitizedProperties;
  }

  if (isFunction(sanitizedName)) {
    payload.category = sanitizedCategory as string;
    payload.name = undefined;
    payload.properties = undefined;
    payload.options = undefined;
    payload.callback = sanitizedName;
  }

  if (isFunction(sanitizedCategory)) {
    payload.category = undefined;
    payload.name = undefined;
    payload.properties = undefined;
    payload.options = undefined;
    payload.callback = sanitizedCategory;
  }

  if (isObjectLiteralAndNotNull(sanitizedCategory)) {
    payload.name = undefined;
    payload.category = undefined;
    payload.properties = sanitizedCategory as Nullable<ApiObject>;
    if (!isFunction(sanitizedName)) {
      payload.options = sanitizedName as Nullable<ApiOptions>;
    } else {
      payload.options = undefined;
    }
  } else if (isObjectLiteralAndNotNull(sanitizedName)) {
    payload.name = undefined;
    payload.properties = sanitizedName as Nullable<ApiObject>;
    if (!isFunction(sanitizedProperties)) {
      payload.options = sanitizedProperties as Nullable<ApiOptions>;
    } else {
      payload.options = undefined;
    }
  }

  // if the category argument alone is provided b/w category and name,
  // use it as name and set category to undefined
  if (isString(sanitizedCategory) && !isString(sanitizedName)) {
    payload.category = undefined;
    payload.name = sanitizedCategory;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (!isDefined(payload.category)) {
    payload.category = undefined;
  }

  if (!isDefined(payload.name)) {
    payload.name = undefined;
  }

  payload.properties = payload.properties ? clone(payload.properties) : {};

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    payload.options = undefined;
  }

  const nameForProperties = isString(payload.name) ? payload.name : payload.properties.name;
  const categoryForProperties = isString(payload.category)
    ? payload.category
    : payload.properties.category;

  // add name and category to properties
  payload.properties = mergeDeepRight(
    isObjectLiteralAndNotNull(payload.properties) ? payload.properties : {},
    {
      ...(nameForProperties && { name: nameForProperties }),
      ...(categoryForProperties && { category: categoryForProperties }),
    },
  );

  return payload;
};

/*
 * Normalise the overloaded arguments of the track call facade
 */
const trackArgumentsToCallOptions = (
  event: string,
  properties?: Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): TrackCallOptions => {
  const sanitizedEvent = getSanitizedValue(event);
  const sanitizedProperties = getSanitizedValue(properties);
  const sanitizedOptions = getSanitizedValue(options);
  const sanitizedCallback = getSanitizedValue(callback);

  const payload: TrackCallOptions = {
    name: sanitizedEvent,
    properties: sanitizedProperties as Nullable<ApiObject>,
    options: sanitizedOptions as Nullable<ApiOptions>,
    callback: undefined,
  };

  if (isFunction(sanitizedCallback)) {
    payload.callback = sanitizedCallback;
  }

  if (isFunction(sanitizedOptions)) {
    payload.properties = sanitizedProperties as Nullable<ApiObject>;
    payload.options = undefined;
    payload.callback = sanitizedOptions;
  }

  if (isFunction(sanitizedProperties)) {
    payload.properties = undefined;
    payload.options = undefined;
    payload.callback = sanitizedProperties;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  payload.properties = isDefinedAndNotNull(payload.properties) ? clone(payload.properties) : {};

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    payload.options = undefined;
  }

  return payload;
};

/*
 * Normalise the overloaded arguments of the identify call facade
 */
const identifyArgumentsToCallOptions = (
  userId: string | number | Nullable<IdentifyTraits>,
  traits?: Nullable<IdentifyTraits> | Nullable<ApiOptions> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): IdentifyCallOptions => {
  const sanitizedUserId = getSanitizedValue(userId);
  const sanitizedTraits = getSanitizedValue(traits);
  const sanitizedOptions = getSanitizedValue(options);
  const sanitizedCallback = getSanitizedValue(callback);

  const payload: IdentifyCallOptions = {
    userId: sanitizedUserId as string,
    traits: sanitizedTraits as Nullable<IdentifyTraits>,
    options: sanitizedOptions as Nullable<ApiOptions>,
    callback: undefined,
  };

  if (isFunction(sanitizedCallback)) {
    payload.callback = sanitizedCallback;
  }

  if (isFunction(sanitizedOptions)) {
    payload.userId = sanitizedUserId as string;
    payload.traits = sanitizedTraits as Nullable<IdentifyTraits>;
    payload.options = undefined;
    payload.callback = sanitizedOptions;
  }

  if (isFunction(sanitizedTraits)) {
    payload.userId = sanitizedUserId as string;
    payload.traits = undefined;
    payload.options = undefined;
    payload.callback = sanitizedTraits;
  }

  if (isObjectLiteralAndNotNull(sanitizedUserId) || isNull(sanitizedUserId)) {
    // Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.userId = null;
    payload.traits = sanitizedUserId as Nullable<IdentifyTraits>;
    if (!isFunction(sanitizedTraits)) {
      payload.options = sanitizedTraits as Nullable<ApiOptions>;
    } else {
      payload.options = undefined;
    }
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  payload.userId = tryStringify(payload.userId);

  if (isObjectLiteralAndNotNull(payload.traits)) {
    payload.traits = clone(payload.traits);
  } else {
    payload.traits = undefined;
  }

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    payload.options = undefined;
  }

  return payload;
};

/*
 * Normalise the overloaded arguments of the alias call facade
 */
const aliasArgumentsToCallOptions = (
  to: string,
  from?: string | Nullable<ApiOptions> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): AliasCallOptions => {
  const sanitizedTo = getSanitizedValue(to);
  const sanitizedFrom = getSanitizedValue(from);
  const sanitizedOptions = getSanitizedValue(options);
  const sanitizedCallback = getSanitizedValue(callback);

  const payload: AliasCallOptions = {
    to: sanitizedTo,
    from: sanitizedFrom as string,
    options: sanitizedOptions as Nullable<ApiOptions>,
    callback: undefined,
  };

  if (isFunction(sanitizedCallback)) {
    payload.callback = sanitizedCallback;
  }

  if (isFunction(sanitizedOptions)) {
    payload.to = sanitizedTo;
    payload.from = sanitizedFrom as string;
    payload.options = undefined;
    payload.callback = sanitizedOptions;
  }

  if (isFunction(sanitizedFrom)) {
    payload.to = sanitizedTo;
    payload.from = undefined;
    payload.options = undefined;
    payload.callback = sanitizedFrom;
  } else if (isObjectLiteralAndNotNull(sanitizedFrom) || isNull(sanitizedFrom)) {
    payload.to = sanitizedTo;
    payload.from = undefined;
    payload.options = sanitizedFrom as Nullable<ApiOptions>;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (isDefined(payload.to)) {
    payload.to = tryStringify(payload.to) as typeof payload.to;
  }

  if (isDefined(payload.from)) {
    payload.from = tryStringify(payload.from) as typeof payload.from;
  } else {
    payload.from = undefined;
  }

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    payload.options = undefined;
  }

  return payload;
};

/*
 * Normalise the overloaded arguments of the group call facade
 */
const groupArgumentsToCallOptions = (
  groupId: string | number | Nullable<ApiObject>,
  traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): GroupCallOptions => {
  const sanitizedGroupId = getSanitizedValue(groupId);
  const sanitizedTraits = getSanitizedValue(traits);
  const sanitizedOptions = getSanitizedValue(options);
  const sanitizedCallback = getSanitizedValue(callback);

  const payload: GroupCallOptions = {
    groupId: sanitizedGroupId as string,
    traits: sanitizedTraits as Nullable<ApiObject>,
    options: sanitizedOptions as Nullable<ApiOptions>,
    callback: undefined,
  };

  if (isFunction(sanitizedCallback)) {
    payload.callback = sanitizedCallback;
  }

  if (isFunction(sanitizedOptions)) {
    payload.groupId = sanitizedGroupId as string;
    payload.traits = sanitizedTraits as Nullable<ApiObject>;
    payload.options = undefined;
    payload.callback = sanitizedOptions;
  }

  if (isFunction(sanitizedTraits)) {
    payload.groupId = sanitizedGroupId as string;
    payload.traits = undefined;
    payload.options = undefined;
    payload.callback = sanitizedTraits;
  }

  if (isObjectLiteralAndNotNull(sanitizedGroupId) || isNull(sanitizedGroupId)) {
    // Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.groupId = null;
    payload.traits = sanitizedGroupId as Nullable<ApiObject>;
    if (!isFunction(sanitizedTraits)) {
      payload.options = sanitizedTraits as Nullable<ApiOptions>;
    } else {
      payload.options = undefined;
    }
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  payload.groupId = tryStringify(payload.groupId);

  if (isObjectLiteralAndNotNull(payload.traits)) {
    payload.traits = clone(payload.traits);
  } else {
    payload.traits = undefined;
  }

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    payload.options = undefined;
  }

  return payload;
};

export {
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
};
