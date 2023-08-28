import { clone } from 'ramda';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { ApiCallback, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import {
  isObjectLiteralAndNotNull,
  mergeDeepRight,
} from '@rudderstack/analytics-js-common/utilities/object';
import {
  isDefined,
  isDefinedAndNotNull,
  isFunction,
  isNull,
  isString,
} from '@rudderstack/analytics-js-common/utilities/checks';
import { tryStringify } from '@rudderstack/analytics-js-common/utilities/string';

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
  userId?: string | null;
  traits?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

export type AliasCallOptions = {
  to?: Nullable<string>;
  from?: Nullable<string>;
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
  const payload: PageCallOptions = {
    category: category as string,
    name: name as string,
    properties: properties as Nullable<ApiObject>,
    options: options as Nullable<ApiOptions>,
  };

  if (isFunction(callback)) {
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = properties as Nullable<ApiObject>;
    delete payload.options;
    payload.callback = options as ApiCallback;
  }

  if (isFunction(properties)) {
    payload.category = category as string;
    payload.name = name as string;
    delete payload.properties;
    delete payload.options;
    payload.callback = properties as ApiCallback;
  }

  if (isFunction(name)) {
    payload.category = category as string;
    delete payload.name;
    delete payload.properties;
    delete payload.options;
    payload.callback = name as ApiCallback;
  }

  if (isFunction(category)) {
    delete payload.category;
    delete payload.name;
    delete payload.properties;
    delete payload.options;
    payload.callback = category as ApiCallback;
  }

  if (isObjectLiteralAndNotNull(category)) {
    delete payload.name;
    delete payload.category;
    payload.properties = category as Nullable<ApiObject>;
    payload.options = name as Nullable<ApiOptions>;
  } else if (isObjectLiteralAndNotNull(name)) {
    delete payload.name;
    payload.properties = name as Nullable<ApiObject>;
    payload.options = !isFunction(properties) ? (properties as Nullable<ApiOptions>) : null;
  }

  // if the category argument alone is provided b/w category and name,
  // use it as name and set category to undefined
  if (isString(category) && !isString(name)) {
    delete payload.category;
    payload.name = category as string;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (!isDefined(payload.category)) {
    delete payload.category;
  }

  if (!isDefined(payload.name)) {
    delete payload.name;
  }

  payload.properties = payload.properties ? clone(payload.properties) : {};

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    delete payload.options;
  }

  // add name and category to properties
  payload.properties = mergeDeepRight(
    isObjectLiteralAndNotNull(payload.properties) ? payload.properties : {},
    {
      name: isString(payload.name) ? payload.name : null,
      category: isString(payload.category) ? payload.category : null,
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
  const payload: TrackCallOptions = {
    name: event,
    properties: properties as Nullable<ApiObject>,
    options: options as Nullable<ApiOptions>,
  };

  if (isFunction(callback)) {
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.properties = properties as Nullable<ApiObject>;
    delete payload.options;
    payload.callback = options as ApiCallback;
  }

  if (isFunction(properties)) {
    delete payload.properties;
    delete payload.options;
    payload.callback = properties as ApiCallback;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  payload.properties = isDefinedAndNotNull(payload.properties) ? clone(payload.properties) : {};

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    delete payload.options;
  }

  return payload;
};

/*
 * Normalise the overloaded arguments of the identify call facade
 */
const identifyArgumentsToCallOptions = (
  userId?: Nullable<ApiObject | string | number>,
  traits?: Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): IdentifyCallOptions => {
  const payload: IdentifyCallOptions = {
    userId: userId as string,
    traits: traits as Nullable<ApiObject>,
    options: options as Nullable<ApiOptions>,
  };

  if (isFunction(callback)) {
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.userId = userId as string;
    payload.traits = traits as Nullable<ApiObject>;
    delete payload.options;
    payload.callback = options as ApiCallback;
  }

  if (isFunction(traits)) {
    payload.userId = userId as string;
    delete payload.traits;
    delete payload.options;
    payload.callback = traits as ApiCallback;
  }

  if (isObjectLiteralAndNotNull(userId) || isNull(userId)) {
    // Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.userId = null;
    payload.traits = userId as Nullable<ApiObject>;
    payload.options = traits as Nullable<ApiOptions>;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (isDefined(payload.userId)) {
    payload.userId = tryStringify(payload.userId);
  } else {
    delete payload.userId;
  }

  if (isObjectLiteralAndNotNull(payload.traits)) {
    payload.traits = clone(payload.traits);
  } else {
    delete payload.traits;
  }

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    delete payload.options;
  }

  return payload;
};

/*
 * Normalise the overloaded arguments of the alias call facade
 */
const aliasArgumentsToCallOptions = (
  to?: Nullable<string> | ApiCallback,
  from?: string | Nullable<ApiOptions> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): AliasCallOptions => {
  const payload: AliasCallOptions = {
    to: to as string,
    from: from as string,
    options: options as Nullable<ApiOptions>,
  };

  if (isFunction(callback)) {
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.to = to as string;
    payload.from = from as string;
    delete payload.options;
    payload.callback = options as ApiCallback;
  }

  if (isFunction(from)) {
    payload.to = to as string;
    delete payload.from;
    delete payload.options;
    payload.callback = from as ApiCallback;
  } else if (isObjectLiteralAndNotNull(from) || isNull(from)) {
    payload.to = to as string;
    delete payload.from;
    payload.options = from as Nullable<ApiOptions>;
  }

  if (isFunction(to)) {
    delete payload.to;
    delete payload.from;
    delete payload.options;
    payload.callback = to as ApiCallback;
  } else if (isObjectLiteralAndNotNull(to) || isNull(to)) {
    delete payload.to;
    delete payload.from;
    payload.options = to as Nullable<ApiOptions>;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (isDefined(payload.to)) {
    payload.to = tryStringify(payload.to);
  } else {
    delete payload.to;
  }

  if (isDefined(payload.from)) {
    payload.from = tryStringify(payload.from);
  } else {
    delete payload.from;
  }

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    delete payload.options;
  }

  return payload;
};

/*
 * Normalise the overloaded arguments of the group call facade
 */
const groupArgumentsToCallOptions = (
  groupId: string | number | Nullable<ApiObject> | ApiCallback,
  traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): GroupCallOptions => {
  const payload: GroupCallOptions = {
    groupId: groupId as string,
    traits: traits as Nullable<ApiObject>,
    options: options as Nullable<ApiOptions>,
  };

  if (isFunction(callback)) {
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.groupId = groupId as string;
    payload.traits = traits as Nullable<ApiObject>;
    delete payload.options;
    payload.callback = options as ApiCallback;
  }

  if (isFunction(traits)) {
    payload.groupId = groupId as string;
    delete payload.traits;
    delete payload.options;
    payload.callback = traits as ApiCallback;
  }

  // TODO: why do we enable overload for group that only passes callback? is there any use case?
  if (isFunction(groupId)) {
    // Explicitly set null to prevent resetting the existing value
    payload.groupId = null;
    delete payload.traits;
    delete payload.options;
    payload.callback = groupId as ApiCallback;
  } else if (isObjectLiteralAndNotNull(groupId) || isNull(groupId)) {
    // Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.groupId = null;
    payload.traits = groupId as Nullable<ApiObject>;
    payload.options = !isFunction(traits) ? (traits as Nullable<ApiOptions>) : null;
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (isDefined(payload.groupId)) {
    payload.groupId = tryStringify(payload.groupId);
  } else {
    delete payload.groupId;
  }

  payload.traits = isObjectLiteralAndNotNull(payload.traits) ? clone(payload.traits) : {};

  if (isDefined(payload.options)) {
    payload.options = clone(payload.options);
  } else {
    delete payload.options;
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
