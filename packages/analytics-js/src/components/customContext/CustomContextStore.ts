import { clone } from 'ramda';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { CustomContextState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { prepareCustomContextUpdate } from './utilities';
import type { CustomContext } from './types';

const deleteValueAtPath = (context: CustomContext, path: string[]): void => {
  if (path.length === 0) {
    return;
  }

  let parent: CustomContext = context;

  for (let index = 0; index < path.length - 1; index += 1) {
    const value = parent[path[index]!];
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    parent = value as CustomContext;
  }

  delete parent[path[path.length - 1]!];
};

class CustomContextStore {
  private state: CustomContextState;
  private logger: ILogger;

  constructor(state: CustomContextState, logger: ILogger) {
    this.state = state;
    this.logger = logger;
  }

  set(context: unknown): void {
    const update = prepareCustomContextUpdate(context, this.logger);
    if (!update) {
      return;
    }

    const workingContext = clone(this.state.value);
    update.deletionPaths.forEach(path => deleteValueAtPath(workingContext, path));
    this.state.value = mergeDeepRight(workingContext, update.context);
  }

  get(): CustomContext {
    return clone(this.state.value);
  }

  clear(): void {
    this.state.value = {};
  }
}

export { CustomContextStore };
