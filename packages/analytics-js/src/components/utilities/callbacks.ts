import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { isDefined, isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { CALLBACK_INVOKE_ERROR, INVALID_CALLBACK_FN_ERROR } from '../../constants/logMessages';

const safelyInvokeCallback = (
  callback: unknown,
  args: unknown[],
  apiName: string,
  logger: ILogger,
): void => {
  if (!isDefined(callback)) {
    return;
  }

  if (isFunction(callback)) {
    try {
      callback(...args);
    } catch (error) {
      logger.error(CALLBACK_INVOKE_ERROR(apiName), error);
    }
  } else {
    logger.error(INVALID_CALLBACK_FN_ERROR(apiName));
  }
};

export { safelyInvokeCallback };
