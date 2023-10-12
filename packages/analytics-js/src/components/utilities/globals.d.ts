import { DebouncedFunction } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ExposedGlobals } from '../../app/IRudderStackGlobals';
/**
 * Create globally accessible RudderStackGlobals object
 */
declare const createExposedGlobals: (analyticsInstanceId?: string) => void;
/**
 * Add move values to globally accessible RudderStackGlobals object per analytics instance
 */
declare const setExposedGlobal: (
  keyName: string,
  value?: any,
  analyticsInstanceId?: string,
) => void;
/**
 * Get values from globally accessible RudderStackGlobals object by analytics instance
 */
declare const getExposedGlobal: (
  keyName: string,
  analyticsInstanceId?: string,
) => Partial<ExposedGlobals>;
declare function debounce(
  func: DebouncedFunction,
  thisArg: any,
  delay?: number,
): (...args: any[]) => void;
export { createExposedGlobals, setExposedGlobal, getExposedGlobal, debounce };
