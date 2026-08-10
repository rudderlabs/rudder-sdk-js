import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { getSanitizedValue } from '@rudderstack/analytics-js-common/utilities/json';
import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { clone } from 'ramda';
import {
  INVALID_CUSTOM_CONTEXT_WARNING,
  RESERVED_CUSTOM_CONTEXT_KEY_WARNING,
} from '../../constants/logMessages';
import { CONTEXT_RESERVED_ELEMENTS } from '../eventManager/constants';
import type { UnknownContext } from './types';

const CUSTOM_CONTEXT = 'CustomContext';
const PROTOTYPE_POLLUTION_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const OBJECT_CONSTRUCTOR_SOURCE = Function.prototype.toString.call(Object);

const isPlainObject = (value: unknown): value is UnknownContext => {
  if (!isObjectLiteralAndNotNull(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) {
    return true;
  }

  const constructor = Object.prototype.hasOwnProperty.call(prototype, 'constructor')
    ? prototype.constructor
    : undefined;

  return (
    typeof constructor === 'function' &&
    constructor.prototype === prototype &&
    Function.prototype.toString.call(constructor) === OBJECT_CONSTRUCTOR_SOURCE
  );
};

const containsPrototypePollutionKey = (
  value: unknown,
  visitedObjects = new Set<object>(),
): boolean => {
  if (!isObjectLiteralAndNotNull(value) && !Array.isArray(value)) {
    return false;
  }

  const traversableValue = value as UnknownContext;
  if (visitedObjects.has(traversableValue)) {
    return false;
  }

  visitedObjects.add(traversableValue);

  return Object.keys(traversableValue).some(key => {
    return (
      PROTOTYPE_POLLUTION_KEYS.has(key) ||
      containsPrototypePollutionKey(traversableValue[key], visitedObjects)
    );
  });
};

const filterReservedCustomContextKeys = (
  context: UnknownContext,
  logger: ILogger,
): UnknownContext => {
  const retainedContext: UnknownContext = {};

  Object.keys(context).forEach(key => {
    if (CONTEXT_RESERVED_ELEMENTS.includes(key)) {
      logger.warn(RESERVED_CUSTOM_CONTEXT_KEY_WARNING(CUSTOM_CONTEXT, key));
      return;
    }

    Object.defineProperty(retainedContext, key, {
      configurable: true,
      enumerable: true,
      value: context[key] === context ? retainedContext : context[key],
      writable: true,
    });
  });

  return retainedContext;
};

const prepareCustomContextUpdate = (
  input: unknown,
  logger: ILogger,
): UnknownContext | undefined => {
  try {
    if (!isPlainObject(input)) {
      logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
      return undefined;
    }

    const acceptedInput = filterReservedCustomContextKeys(input, logger);

    if (containsPrototypePollutionKey(acceptedInput)) {
      logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
      return undefined;
    }

    const sanitizedContext = getSanitizedValue(acceptedInput, logger);

    return clone(sanitizedContext as UnknownContext);
  } catch {
    logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
    return undefined;
  }
};

export {
  containsPrototypePollutionKey,
  filterReservedCustomContextKeys,
  prepareCustomContextUpdate,
};
