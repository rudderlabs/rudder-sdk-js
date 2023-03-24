export type ScreenInfo = {
  density: number;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
};

const getScreenDetails = (): ScreenInfo => {
  const screenDetails: ScreenInfo = {
    density: 0,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  };

  // Depending on environment within which the code is executing, screen
  // dimensions can be set, when execution is in SSR window will be undefined
  if (typeof window === 'undefined') {
    return screenDetails;
  }

  screenDetails.width = window.screen.width;
  screenDetails.height = window.screen.height;
  screenDetails.density = window.devicePixelRatio;
  screenDetails.innerWidth = window.innerWidth;
  screenDetails.innerHeight = window.innerHeight;

  return screenDetails;
};

export { getScreenDetails };
