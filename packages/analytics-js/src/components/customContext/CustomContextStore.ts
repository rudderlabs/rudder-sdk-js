import { clone } from 'ramda';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { CustomContextState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import {
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import type { CustomContext } from '@rudderstack/analytics-js-common/types/CustomContext';
import { prepareCustomContextUpdate } from './utilities';

class CustomContextStore {
  private readonly state: CustomContextState;
  private readonly logger: ILogger;

  constructor(state: CustomContextState, logger: ILogger) {
    this.state = state;
    this.logger = logger;
  }

  set(context: unknown): void {
    const update = prepareCustomContextUpdate(context, this.logger);
    if (!update) {
      return;
    }

    const mergedContext = mergeDeepRight(clone(this.state.value), update);
    this.state.value = removeUndefinedAndNullValues(mergedContext);
  }

  get(): CustomContext {
    return clone(this.state.value);
  }

  clear(): void {
    this.state.value = {};
  }
}

export { CustomContextStore };
