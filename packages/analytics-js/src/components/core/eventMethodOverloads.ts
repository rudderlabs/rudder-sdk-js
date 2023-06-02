import { clone } from 'ramda';
import {
  isObjectLiteralAndNotNull,
  mergeDeepRight,
} from '@rudderstack/analytics-js/components/utilities/object';
import { ApiCallback, ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  isFunction,
  isNull,
  isString,
  isUndefined,
} from '@rudderstack/analytics-js/components/utilities/checks';
import { tryStringify } from '../utilities/string';

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
  const payload: PageCallOptions = {};

  if (isFunction(callback)) {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.callback = options as ApiCallback;
  }

  if (isFunction(properties)) {
    payload.category = category as string;
    payload.name = name as string;
    payload.callback = properties as ApiCallback;
  }

  if (isFunction(name)) {
    payload.category = category as string;
    payload.callback = name as ApiCallback;
  }

  if (isFunction(category)) {
    payload.callback = category as ApiCallback;
  }

  if (isObjectLiteralAndNotNull(category)) {
    payload.options = clone(name as Nullable<ApiOptions>);
    payload.properties = clone(category as Nullable<ApiObject>);
    delete payload.name;
    delete payload.category;
  } else if (isObjectLiteralAndNotNull(name)) {
    payload.options = clone(properties as Nullable<ApiOptions>);
    payload.properties = clone(name as Nullable<ApiObject>);
    delete payload.name;
  }

  if (isString(payload.category) && !isString(payload.name)) {
    payload.name = payload.category;
    delete payload.category;
  }

  if (isUndefined(payload.category)) {
    delete payload.category;
  }

  payload.properties = mergeDeepRight(
    payload.properties && isObjectLiteralAndNotNull(payload.properties) ? payload.properties : {},
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
  };

  if (isFunction(callback)) {
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.callback = options as ApiCallback;
  }

  if (isFunction(properties)) {
    payload.callback = properties as ApiCallback;
  }

  if (isObjectLiteralAndNotNull(options) || isNull(options)) {
    payload.options = options as Nullable<ApiOptions>;
  }

  if (isObjectLiteralAndNotNull(properties) || isNull(properties)) {
    payload.properties = properties as Nullable<ApiObject>;
  }

  // To match v1.1 generated payload
  if (isUndefined(payload.properties) || isNull(payload.properties)) {
    payload.properties = {};
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
  const payload: IdentifyCallOptions = {};

  if (isFunction(callback)) {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.callback = options as ApiCallback;
  }

  if (isFunction(traits)) {
    payload.callback = traits as ApiCallback;
  }

  if (isObjectLiteralAndNotNull(userId) || isNull(userId)) {
    delete payload.userId;
    payload.traits = clone(userId as Nullable<ApiObject>);
    payload.options = clone(traits as Nullable<ApiOptions>);
  } else {
    payload.userId = tryStringify(userId);

    if (!isUndefined(traits) && !isFunction(traits)) {
      payload.traits = clone(traits as Nullable<ApiObject>);
    }

    if (!isUndefined(options) && !isFunction(options)) {
      payload.options = clone(options as Nullable<ApiOptions>);
    }
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
  const payload: AliasCallOptions = {};

  if (isFunction(callback)) {
    payload.to = tryStringify(to) ?? null;
    payload.from = from as string;
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.to = tryStringify(to) ?? null;
    payload.from = from as string;
    payload.callback = options as ApiCallback;
  }

  if (isFunction(from)) {
    payload.to = tryStringify(to) ?? null;
    payload.callback = from as ApiCallback;
  } else if (isObjectLiteralAndNotNull(from) || isNull(from)) {
    payload.to = tryStringify(to) ?? null;
    payload.options = isNull(from) ? null : clone(from as Nullable<ApiOptions>);
    delete payload.from;
  } else {
    payload.to = tryStringify(to) ?? null;
    payload.from = tryStringify(from);
  }

  if (isFunction(to)) {
    payload.to = null;
    payload.callback = to as ApiCallback;
  }

  if (isObjectLiteralAndNotNull(to)) {
    payload.to = null;
    payload.options = clone(to as Nullable<ApiOptions>);
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
  const payload: GroupCallOptions = {};

  if (isFunction(callback)) {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (isFunction(options)) {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.callback = options as ApiCallback;
  }

  if (isFunction(traits)) {
    payload.callback = traits as ApiCallback;
  }

  // TODO: why do we enable overload for group that only passes callback? is there any use case?
  if (isFunction(groupId)) {
    payload.callback = groupId as ApiCallback;
  } else if (isObjectLiteralAndNotNull(groupId) || isNull(groupId)) {
    payload.traits = isNull(groupId) ? null : clone(groupId as Nullable<ApiObject>);

    if (isFunction(traits)) {
      payload.callback = traits as ApiCallback;
    } else {
      payload.options = clone(traits as Nullable<ApiOptions>);
    }
  } else {
    payload.groupId = tryStringify(groupId);
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
