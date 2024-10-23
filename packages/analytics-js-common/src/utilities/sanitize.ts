import type { ILogger } from '../types/Logger';
import { stringifyWithoutCircular } from './json';

/**
 * Handles circular references and BigInts in the input value
 * @param value Input value
 * @param logger Logger instance
 * @returns Sanitized value
 */
const getSanitizedValue = (value: any, logger?: ILogger): any =>
  JSON.parse(stringifyWithoutCircular(value, { excludeNull: false }, logger) as string);

export { getSanitizedValue };
