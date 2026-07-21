import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { getSanitizedValue } from '@rudderstack/analytics-js-common/utilities/json';
import { clone } from 'ramda';
import {
  INVALID_CUSTOM_CONTEXT_WARNING,
  RESERVED_KEYWORD_WARNING,
} from '../../constants/logMessages';
import { CONTEXT_RESERVED_ELEMENTS } from '../eventManager/constants';

const CUSTOM_CONTEXT = 'CustomContext';
const CUSTOM_CONTEXT_PARENT_KEY_PATH = 'custom context';

type CustomContextRecord = Record<string, unknown>;
type CustomContextDeletionPath = string[];

type ValidCustomContextUpdate = {
  isValid: true;
  context: CustomContextRecord;
  deletionPaths: CustomContextDeletionPath[];
};

type InvalidCustomContextUpdate = {
  isValid: false;
};

type NormalizedCustomContextUpdate = ValidCustomContextUpdate | InvalidCustomContextUpdate;

const isPlainObject = (value: unknown): value is CustomContextRecord => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const extractDeletionMarkers = (
  context: CustomContextRecord,
): Pick<ValidCustomContextUpdate, 'context' | 'deletionPaths'> => {
  const deletionPaths: CustomContextDeletionPath[] = [];
  const visitedObjects = new WeakMap<object, CustomContextRecord>();

  const visitObject = (value: CustomContextRecord, parentPath: string[]): CustomContextRecord => {
    const visitedValue = visitedObjects.get(value);
    if (visitedValue) {
      return visitedValue;
    }

    const retainedValue: CustomContextRecord = {};
    visitedObjects.set(value, retainedValue);

    Object.keys(value).forEach(key => {
      const childValue = value[key];
      const childPath = [...parentPath, key];

      if (childValue === null || childValue === undefined) {
        deletionPaths.push(childPath);
      } else if (isPlainObject(childValue)) {
        retainedValue[key] = visitObject(childValue, childPath);
      } else {
        retainedValue[key] = childValue;
      }
    });

    return retainedValue;
  };

  return {
    context: visitObject(context, []),
    deletionPaths,
  };
};

const isValidCustomContextValue = (value: unknown): boolean => {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.every(
      item => item !== null && item !== undefined && isValidCustomContextValue(item),
    );
  }

  if (isPlainObject(value)) {
    return Object.values(value).every(isValidCustomContextValue);
  }

  return false;
};

const filterReservedKeys = (
  context: CustomContextRecord,
  deletionPaths: CustomContextDeletionPath[],
  attemptedKeys: string[],
  logger: ILogger,
): Pick<ValidCustomContextUpdate, 'context' | 'deletionPaths'> => {
  const filteredContext = { ...context };
  const reservedKeys = attemptedKeys.filter(key => CONTEXT_RESERVED_ELEMENTS.includes(key));

  reservedKeys.forEach(key => {
    delete filteredContext[key];
    logger.warn(
      RESERVED_KEYWORD_WARNING(
        CUSTOM_CONTEXT,
        key,
        CUSTOM_CONTEXT_PARENT_KEY_PATH,
        CONTEXT_RESERVED_ELEMENTS,
      ),
    );
  });

  return {
    context: filteredContext,
    deletionPaths: deletionPaths.filter(path => !reservedKeys.includes(path[0]!)),
  };
};

/**
 * Normalizes a load-time or runtime custom context update without mutating SDK state.
 * Store deletion and merge are intentionally left to the instance-owned store.
 */
const normalizeCustomContextUpdate = (
  input: unknown,
  logger: ILogger,
): NormalizedCustomContextUpdate => {
  if (!isPlainObject(input)) {
    logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
    return { isValid: false };
  }

  const attemptedKeys = Object.keys(input);
  const extractedUpdate = extractDeletionMarkers(input);
  const sanitizedContext = getSanitizedValue(extractedUpdate.context, logger);

  if (!isValidCustomContextValue(sanitizedContext)) {
    logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
    return { isValid: false };
  }

  const filteredUpdate = filterReservedKeys(
    sanitizedContext,
    extractedUpdate.deletionPaths,
    attemptedKeys,
    logger,
  );

  return {
    isValid: true,
    context: clone(filteredUpdate.context),
    deletionPaths: filteredUpdate.deletionPaths.map(path => [...path]),
  };
};

export { normalizeCustomContextUpdate };
export type { NormalizedCustomContextUpdate };
