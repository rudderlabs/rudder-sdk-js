import { clone } from 'ramda';
import type { ApiObject } from '../types/ApiObject';
import type { ApiCallback, ApiOptions } from '../types/EventApi';
import type { Nullable } from '../types/Nullable';
import { isObjectLiteralAndNotNull, mergeDeepRight } from './object';
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
  to?: string;
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
    if (!isFunction(name)) {
      payload.options = name as Nullable<ApiOptions>;
    } else {
      delete payload.options;
    }
  } else if (isObjectLiteralAndNotNull(name)) {
    delete payload.name;
    payload.properties = name as Nullable<ApiObject>;
    if (!isFunction(properties)) {
      payload.options = properties as Nullable<ApiOptions>;
    } else {
      delete payload.options;
    }
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
  userId: string | number | Nullable<IdentifyTraits>,
  traits?: Nullable<IdentifyTraits> | Nullable<ApiOptions> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): IdentifyCallOptions => {
  const payload: IdentifyCallOptions = {
    userId: userId as string,
    traits: traits as Nullable<IdentifyTraits>,
    options: options as Nullable<ApiOptions>,
  };

  if (isFunction(callback)) {
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.userId = userId as string;
    payload.traits = traits as Nullable<IdentifyTraits>;
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
    payload.traits = userId as Nullable<IdentifyTraits>;
    if (!isFunction(traits)) {
      payload.options = traits as Nullable<ApiOptions>;
    } else {
      delete payload.options;
    }
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
  to: string,
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

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (isDefined(payload.to)) {
    payload.to = tryStringify(payload.to) as typeof payload.to;
  } else {
    delete payload.to;
  }

  if (isDefined(payload.from)) {
    payload.from = tryStringify(payload.from) as typeof payload.from;
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
  groupId: string | number | Nullable<ApiObject>,
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

  if (isObjectLiteralAndNotNull(groupId) || isNull(groupId)) {
    // Explicitly set null to prevent resetting the existing value
    // in the Analytics class
    payload.groupId = null;
    payload.traits = groupId as Nullable<ApiObject>;
    if (!isFunction(traits)) {
      payload.options = traits as Nullable<ApiOptions>;
    } else {
      delete payload.options;
    }
  }

  // Rest of the code is just to clean up undefined values
  // and set some proper defaults
  // Also, to clone the incoming object type arguments
  if (isDefined(payload.groupId)) {
    payload.groupId = tryStringify(payload.groupId);
  } else {
    delete payload.groupId;
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

export {
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
};
