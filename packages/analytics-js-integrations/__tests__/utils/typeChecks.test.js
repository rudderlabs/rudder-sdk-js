import { isArray, isBoolean, isDate, isNumber, isObject } from '../../src/utils/typeChecks';

describe('integration type checks', () => {
  it.each([
    ['arrays', isArray, [[], [1]], [{ 0: 1, length: 1 }, 'array']],
    ['booleans', isBoolean, [false, true, Object(false)], [0, 'false']],
    ['dates', isDate, [new Date(0), new Date(NaN)], [0, '1970-01-01']],
    ['numbers', isNumber, [0, NaN, Infinity, Object(0)], [false, '0']],
    ['objects', isObject, [{}, Object.create(null)], [[], new Date(0), Object(false)]],
  ])('recognizes %s and excludes other values', (_name, predicate, accepted, rejected) => {
    expect(accepted.map(predicate)).toEqual(accepted.map(() => true));
    expect([...rejected, null, undefined].some(predicate)).toBe(false);
  });

  it('recognizes values from another browser frame', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);

    try {
      const realm = frame.contentWindow;
      expect(isArray(realm.Array.of(1))).toBe(true);
      expect(isBoolean(realm.Object(false))).toBe(true);
      expect(isDate(new realm.Date(0))).toBe(true);
      expect(isNumber(realm.Object(0))).toBe(true);
      expect(isObject(realm.Object.create(null))).toBe(true);
    } finally {
      frame.remove();
    }
  });

  it('uses the array tag when Array.isArray is unavailable at module load', () => {
    const nativeIsArray = Array.isArray;
    let fallbackIsArray;

    jest.isolateModules(() => {
      try {
        Array.isArray = undefined;
        ({ isArray: fallbackIsArray } = jest.requireActual('../../src/utils/typeChecks'));
      } finally {
        Array.isArray = nativeIsArray;
      }
    });

    expect(fallbackIsArray([])).toBe(true);
    expect(fallbackIsArray({ 0: 'a', length: 1 })).toBe(false);
    expect(fallbackIsArray(null)).toBe(false);
  });
});
