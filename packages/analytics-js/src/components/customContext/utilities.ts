import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { getSanitizedValue } from '@rudderstack/analytics-js-common/utilities/json';
import { clone } from 'ramda';
import {
  INVALID_CUSTOM_CONTEXT_WARNING,
  RESERVED_KEYWORD_WARNING,
} from '../../constants/logMessages';
import { CONTEXT_RESERVED_ELEMENTS } from '../eventManager/constants';
import type {
  CustomContext,
  CustomContextDeletionPath,
  CustomContextValue,
  PreparedCustomContextUpdate,
} from './types';

const CUSTOM_CONTEXT = 'CustomContext';
const CUSTOM_CONTEXT_PARENT_KEY_PATH = 'custom context';

type UnknownContext = Record<string, unknown>;

const isPlainObject = (value: unknown): value is UnknownContext => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const filterReservedCustomContextKeys = (
  context: UnknownContext,
  logger: ILogger,
): UnknownContext => {
  const retainedContext: UnknownContext = {};

  Object.keys(context).forEach(key => {
    if (CONTEXT_RESERVED_ELEMENTS.includes(key)) {
      logger.warn(
        RESERVED_KEYWORD_WARNING(
          CUSTOM_CONTEXT,
          key,
          CUSTOM_CONTEXT_PARENT_KEY_PATH,
          CONTEXT_RESERVED_ELEMENTS,
        ),
      );
      return;
    }

    retainedContext[key] = context[key];
  });

  return retainedContext;
};

const inspectDeletionMarkers = (
  context: UnknownContext,
  originalRoot: UnknownContext,
): Pick<PreparedCustomContextUpdate, 'context' | 'deletionPaths'> => {
  const deletionPaths: CustomContextDeletionPath[] = [];
  const activeObjects: object[] = [];
  const activeRetainedValues: UnknownContext[] = [];

  const visitObject = (value: UnknownContext, parentPath: string[]): UnknownContext => {
    const retainedValue: UnknownContext = {};
    activeObjects.push(value);
    activeRetainedValues.push(retainedValue);
    if (parentPath.length === 0 && originalRoot !== value) {
      activeObjects.push(originalRoot);
      activeRetainedValues.push(retainedValue);
    }

    Object.keys(value).forEach(key => {
      const childValue = value[key];
      const childPath = [...parentPath, key];

      if (childValue === null || childValue === undefined) {
        deletionPaths.push(childPath);
      } else if (isPlainObject(childValue)) {
        const activeObjectIndex = activeObjects.indexOf(childValue);
        if (activeObjectIndex >= 0) {
          retainedValue[key] = activeRetainedValues[activeObjectIndex];
          return;
        }

        const retainedChildValue = visitObject(childValue, childPath);
        if (Object.keys(retainedChildValue).length > 0) {
          retainedValue[key] = retainedChildValue;
        }
      } else {
        retainedValue[key] = childValue;
      }
    });

    activeObjects.pop();
    activeRetainedValues.pop();
    if (parentPath.length === 0) {
      activeObjects.pop();
      activeRetainedValues.pop();
    }
    return retainedValue;
  };

  return {
    context: visitObject(context, []) as CustomContext,
    deletionPaths,
  };
};

const isValidCustomContextValue = (value: unknown): value is CustomContextValue => {
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

const prepareCustomContextUpdate = (
  input: unknown,
  logger: ILogger,
): PreparedCustomContextUpdate | undefined => {
  if (!isPlainObject(input)) {
    logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
    return undefined;
  }

  const acceptedInput = filterReservedCustomContextKeys(input, logger);
  const inspectedUpdate = inspectDeletionMarkers(acceptedInput, input);
  const sanitizedContext = getSanitizedValue(inspectedUpdate.context, logger);

  if (!isValidCustomContextValue(sanitizedContext)) {
    logger.warn(INVALID_CUSTOM_CONTEXT_WARNING(CUSTOM_CONTEXT));
    return undefined;
  }

  return {
    context: clone(sanitizedContext as CustomContext),
    deletionPaths: inspectedUpdate.deletionPaths.map(path => [...path]),
  };
};

export { filterReservedCustomContextKeys, prepareCustomContextUpdate };
