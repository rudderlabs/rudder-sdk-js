import type { ScreenInfo } from '@rudderstack/analytics-js-common/types/EventContext';

const getScreenDetails = (): ScreenInfo => ({
  width: globalThis.screen.width,
  height: globalThis.screen.height,
  density: globalThis.devicePixelRatio,
  innerWidth: globalThis.innerWidth,
  innerHeight: globalThis.innerHeight,
});

export { getScreenDetails };
