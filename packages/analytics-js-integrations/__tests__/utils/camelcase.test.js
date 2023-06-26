import camelcase from '../../src/utils/camelcase';

test('convert string with space to camelcase format', () => {
  expect(camelcase('camel case')).toBe('camelCase');
});

test('convert string with underscore to camelcase format', () => {
  expect(camelcase('camel_case')).toBe('camelCase');
});

test('convert string with first letter capital to camelcase format', () => {
  expect(camelcase('Camelcase')).toBe('camelcase');
});

test('convert uppercase string to camelcase format', () => {
  expect(camelcase('CAMELCASE')).toBe('camelcase');
});

test('convert string with first letter capital for each word to camelcase format', () => {
  expect(camelcase('Camel Case')).toBe('camelCase');
});

test('convert non-string values', () => {
  expect(camelcase(123)).toBe('123');
});

test('convert invalid values', () => {
  expect(camelcase()).toBe('');
});
