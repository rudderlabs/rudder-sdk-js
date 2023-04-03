import * as R from 'ramda';
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
  userId?: string | number | null;
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
  groupId?: Nullable<string | number>;
  traits?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: ApiCallback;
};

// TODO: is there any specific reason why we ser the overloaded values to nul instead of undefined?
//   if yes make them null instead of omitting in overloaded cases
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
    payload.properties = R.clone(properties as Nullable<ApiObject>);
    payload.options = R.clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = R.clone(properties as Nullable<ApiObject>);
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
    payload.options = R.clone(name as Nullable<ApiOptions>);
    payload.properties = R.clone(category as Nullable<ApiObject>);
  } else if (typeof name === 'object' && name !== null) {
    payload.options = R.clone(properties as Nullable<ApiOptions>);
    payload.properties = R.clone(name as Nullable<ApiObject>);
  }

  if (typeof category === 'string' && typeof name !== 'string') {
    payload.name = category;
  }

  payload.properties = mergeDeepRight(payload.properties || {}, {
    name: typeof name === 'string' ? name : null,
    category: typeof category === 'string' ? category : null,
  });

  return payload;
};

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
    payload.properties = R.clone(properties as Nullable<ApiObject>);
    payload.options = R.clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.properties = R.clone(properties as Nullable<ApiOptions>);
    payload.callback = options;
  }

  if (typeof properties === 'function') {
    payload.callback = properties;
  }

  return payload;
};

const identifyArgumentsToCallOptions = (
  userId?: string | number | Nullable<ApiObject>,
  traits?: Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): IdentifyCallOptions => {
  const payload: IdentifyCallOptions = {};

  if (typeof callback === 'function') {
    payload.userId = userId as string | number | null | undefined;
    payload.traits = R.clone(traits as Nullable<ApiObject>);
    payload.options = R.clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.userId = userId as string | number | null | undefined;
    payload.traits = R.clone(traits as Nullable<ApiObject>);
    payload.callback = options;
  }

  if (typeof traits === 'function') {
    payload.userId = userId as string | number | null | undefined;
    payload.callback = traits;
  }

  if (typeof userId === 'object') {
    payload.userId = undefined;
    payload.traits = R.clone(userId as Nullable<ApiObject>);
    payload.options = R.clone(traits as Nullable<ApiOptions>);
  }

  return payload;
};

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
    payload.options = R.clone(options as Nullable<ApiOptions>);
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
    payload.options = R.clone(from as Nullable<ApiOptions>);
  }

  return payload;
};

const groupArgumentsToCallOptions = (
  groupId: string | Nullable<ApiObject> | ApiCallback,
  traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
  options?: Nullable<ApiOptions> | ApiCallback,
  callback?: ApiCallback,
): GroupCallOptions => {
  const payload: GroupCallOptions = {};

  if (typeof callback === 'function') {
    payload.groupId = groupId as string;
    payload.traits = R.clone(traits as Nullable<ApiObject>);
    payload.options = R.clone(options as Nullable<ApiOptions>);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.groupId = groupId as string;
    payload.traits = R.clone(traits as Nullable<ApiObject>);
    payload.callback = options;
  }

  if (typeof traits === 'function') {
    payload.groupId = groupId as string;
    payload.callback = traits;
  }

  if (typeof groupId === 'object') {
    payload.traits = R.clone(groupId as Nullable<ApiObject>);

    if (typeof traits === 'function') {
      payload.callback = traits;
    } else {
      payload.options = R.clone(traits as Nullable<ApiOptions>);
    }
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
