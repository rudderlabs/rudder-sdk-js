import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
/**
 * AMP Linker Parser (works for Rudder, GA or any other linker created by following Google's linker standard.)
 *
 * @param {string} value
 *
 * @return {?Object<string, string>}
 */
declare const parseLinker: (value: string) => Nullable<Record<string, string>>;
export { parseLinker };
