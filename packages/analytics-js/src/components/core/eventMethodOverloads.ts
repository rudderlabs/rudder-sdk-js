import * as R from 'ramda';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { ApiCallback, ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';

export type PageCallOptions = {
  category?: string;
  name?: string;
  properties?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type TrackCallOptions = {
  name: string;
  properties?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type IdentifyCallOptions = {
  userId?: string;
  traits?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type AliasCallOptions = {
  to: string;
  from?: string;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type GroupCallOptions = {
  groupId: string;
  traits?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

const pageArgumentsToPageCallOptions = (
  category?: string | ApiObject | ApiCallback,
  name?: string | ApiObject | ApiCallback,
  properties?: ApiObject | ApiCallback,
  options?: ApiOptions | ApiCallback,
  callback?: ApiCallback,
): PageCallOptions => {
  const payload: PageCallOptions = {};

  if (typeof callback === 'function') {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = R.clone(properties as ApiOptions);
    payload.options = R.clone(options as ApiOptions);
    payload.callback = callback;
  }

  if (typeof options === 'function') {
    payload.category = category as string;
    payload.name = name as string;
    payload.properties = R.clone(properties as ApiOptions);
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
    payload.options = R.clone(name as ApiOptions);
    payload.properties = R.clone(category as ApiOptions);
  } else if (typeof name === 'object' && name !== null) {
    payload.options = R.clone(properties as ApiOptions);
    payload.properties = R.clone(name as ApiOptions);
  }

  if (typeof category === 'string' && typeof name !== 'string') {
    payload.name = category;
  }

  payload.properties = mergeDeepRight(payload.properties || {}, { name, category });

  return payload;
};

export { pageArgumentsToPageCallOptions };
