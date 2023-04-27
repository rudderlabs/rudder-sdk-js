export type ScreenInfo = {
  readonly density: number;
  readonly width: number;
  readonly height: number;
  readonly innerWidth: number;
  readonly innerHeight: number;
};

const getScreenDetails = (): ScreenInfo => {
  let screenDetails: ScreenInfo = {
    density: 0,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  };

  // Depending on environment within which the code is executing, screen
  // dimensions can be set, when execution is in SSR window will be undefined
  if (typeof window !== 'undefined') {
    screenDetails = {
      width: window.screen.width,
      height: window.screen.height,
      density: window.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  }
  return screenDetails;
};

export { getScreenDetails };
