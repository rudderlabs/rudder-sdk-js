import {
  isFunction,
  isNull,
  isString,
  isUndefined,
  isNullOrUndefined,
  isTypeOfError,
  isDefined,
  isDefinedAndNotNull,
} from '@rudderstack/analytics-js-common/utilities/checks';

describe('Common Utils - Checks', () => {
  describe('isFunction', () => {
    it('should check if value is function', () => {
      expect(isFunction(() => {})).toBeTruthy();
      expect(isFunction('')).toBeFalsy();
    });
  });

  describe('isString', () => {
    it('should check if value is strng', () => {
      expect(isString('')).toBeTruthy();
      expect(isString({})).toBeFalsy();
      expect(isString(0)).toBeFalsy();
      expect(isString([])).toBeFalsy();
      expect(isString(undefined)).toBeFalsy();
    });
  });

  describe('isNull', () => {
    it('should check if value is null', () => {
      expect(isNull(null)).toBeTruthy();
      expect(isNull('')).toBeFalsy();
      expect(isNull(0)).toBeFalsy();
      expect(isNull([])).toBeFalsy();
      expect(isNull(undefined)).toBeFalsy();
    });
  });

  describe('isUndefined', () => {
    it('should check if value is undefined', () => {
      expect(isUndefined('')).toBeFalsy();
      expect(isUndefined({})).toBeFalsy();
      expect(isUndefined(0)).toBeFalsy();
      expect(isUndefined([])).toBeFalsy();
      expect(isUndefined(null)).toBeFalsy();
      expect(isUndefined(undefined)).toBeTruthy();
    });
  });

  describe('isNullOrUndefined', () => {
    it('should check if value is undefined', () => {
      expect(isNullOrUndefined('')).toBeFalsy();
      expect(isNullOrUndefined({})).toBeFalsy();
      expect(isNullOrUndefined(0)).toBeFalsy();
      expect(isNullOrUndefined([])).toBeFalsy();
      expect(isNullOrUndefined(null)).toBeTruthy();
      expect(isNullOrUndefined(undefined)).toBeTruthy();
    });
  });

  describe('isTypeOfError', () => {
    it('should check if value is instance of Error', () => {
      expect(isTypeOfError(new Error())).toBeTruthy();
      expect(isTypeOfError('')).toBeFalsy();
      expect(isTypeOfError({})).toBeFalsy();
      expect(isTypeOfError(0)).toBeFalsy();
      expect(isTypeOfError([])).toBeFalsy();
      expect(isTypeOfError(null)).toBeFalsy();
      expect(isTypeOfError(undefined)).toBeFalsy();
    });
  });

  describe('isDefined', () => {
    it('should check if value is defined', () => {
      expect(isDefined('')).toBeTruthy();
      expect(isDefined({})).toBeTruthy();
      expect(isDefined(0)).toBeTruthy();
      expect(isDefined([])).toBeTruthy();
      expect(isDefined(null)).toBeTruthy();
      expect(isDefined(undefined)).toBeFalsy();
    });
  });

  describe('isDefinedAndNotNull', () => {
    it('should check if value is defined and not null', () => {
      expect(isDefinedAndNotNull('')).toBeTruthy();
      expect(isDefinedAndNotNull({})).toBeTruthy();
      expect(isDefinedAndNotNull(0)).toBeTruthy();
      expect(isDefinedAndNotNull([])).toBeTruthy();
      expect(isDefinedAndNotNull(null)).toBeFalsy();
      expect(isDefinedAndNotNull(undefined)).toBeFalsy();
    });
  });
});
