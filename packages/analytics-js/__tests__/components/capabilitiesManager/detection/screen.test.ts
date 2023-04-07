import { getScreenDetails } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';

describe('Capabilities Detection - Screen', () => {
  it('should get screen details', () => {
    expect(getScreenDetails()).toStrictEqual({
      density: 1,
      height: 0,
      innerHeight: 1024,
      innerWidth: 1680,
      width: 0,
    });
  });
});
