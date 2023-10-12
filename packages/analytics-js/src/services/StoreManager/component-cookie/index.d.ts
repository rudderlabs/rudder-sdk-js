import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { CookieOptions } from '@rudderstack/analytics-js-common/types/Storage';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * Set or get cookie `name` with `value` and `options` object
 */
declare const cookie: (
  name?: string,
  value?: Nullable<string | number>,
  options?: CookieOptions,
  logger?: ILogger,
) => void | any;
export { cookie };
