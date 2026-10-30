import { destDisplayNamesToFileNamesMap } from '../../src/utilities/destDisplayNamesToFileNamesMap';
import { destDisplayNamesToPinSupportMap } from '../../src/utilities/destDisplayNamesToPinSupportMap';

test('support map contains six full and four no-script declarations', () => {
  expect(destDisplayNamesToPinSupportMap).toEqual({
    Bugsnag: 'full',
    Iterable: 'full',
    Keen: 'full',
    LaunchDarkly: 'full',
    Amplitude: 'full',
    Sentry: 'full',
    Lotame: 'no-script',
    Ninetailed: 'no-script',
    'Optimizely Web': 'no-script',
    Shynet: 'no-script',
  });
  expect(Object.keys(destDisplayNamesToFileNamesMap)).toHaveLength(83);
  expect(
    Object.keys(destDisplayNamesToFileNamesMap).filter(
      name => (destDisplayNamesToPinSupportMap[name] ?? 'none') === 'none',
    ),
  ).toHaveLength(73);
  expect(destDisplayNamesToPinSupportMap.RollBar ?? 'none').toBe('none');
  expect(destDisplayNamesToPinSupportMap.toString ?? 'none').toBe('none');
});
