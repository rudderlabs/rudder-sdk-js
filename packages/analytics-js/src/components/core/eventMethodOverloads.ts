import { clone } from 'ramda';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { ApiCallback, ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';

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
  const payload: PageCallOptions = {};

  if (typeof callback === 'function') {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.callback = options;
  }

  if (typeof properties === 'function') {
    payload.category = category as string;
    payload.name = name as string;
    payload.callback = properties;
  }

  if (typeof name === 'function') {
    payload.category = category as string;
    payload.callback = name;
  }

  if (typeof category === 'function') {
    payload.callback = category;
  }

  if (typeof category === 'object' && category !== null) {
    payload.options = clone(name as Nullable<ApiOptions>);
    payload.properties = clone(category as Nullable<ApiObject>);
    delete payload.name;
    delete payload.category;
  } else if (typeof name === 'object' && name !== null) {
    payload.options = clone(properties as Nullable<ApiOptions>);
    payload.properties = clone(name as Nullable<ApiObject>);
    delete payload.name;
  }

  if (typeof payload.category === 'string' && typeof payload.name !== 'string') {
    payload.name = payload.category;
  }

  payload.properties = mergeDeepRight(
    typeof payload.properties === 'object' && payload.properties !== null ? payload.properties : {},
    {
      name: typeof payload.name === 'string' ? payload.name : null,
      category: typeof payload.category === 'string' ? payload.category : null,
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

  if (typeof callback === 'function') {
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.properties = clone(properties as Nullable<ApiObject>);
    payload.callback = options;
  }

  if (typeof properties === 'function') {
    payload.callback = properties;
  }

  if (typeof options === 'object') {
    payload.options = options;
  }

  if (typeof properties === 'object') {
    payload.properties = properties;
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

  if (typeof callback === 'function') {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.callback = options;
  }

  if (typeof traits === 'function') {
    payload.callback = traits;
  }

  if (typeof userId === 'object') {
    delete payload.userId;
    payload.traits = clone(userId as Nullable<ApiObject>);
    payload.options = clone(traits as Nullable<ApiOptions>);
  } else {
    payload.userId = typeof userId === 'number' ? userId.toString() : userId;
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
    to,
  };

  if (typeof callback === 'function') {
    payload.from = from as string;
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.from = from as string;
    payload.callback = options;
  }

  if (typeof from === 'function') {
    payload.callback = from;
  }

  if (typeof from === 'object') {
    payload.options = clone(from as Nullable<ApiOptions>);
    delete payload.from;
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

  if (typeof callback === 'function') {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.options = clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.traits = clone(traits as Nullable<ApiObject>);
    payload.callback = options;
  }

  if (typeof traits === 'function') {
    payload.callback = traits;
  }

  // TODO: why do we enable overload for group that only passes callback? is there any use case?
  if (typeof groupId === 'function') {
    payload.callback = groupId;
  } else if (typeof groupId === 'object') {
    payload.traits = clone(groupId as Nullable<ApiObject>);

    if (typeof traits === 'function') {
      payload.callback = traits;
    } else {
      payload.options = clone(traits as Nullable<ApiOptions>);
    }
  } else {
    payload.groupId = typeof groupId === 'number' ? groupId.toString() : groupId;
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
