import { RudderScreenInfo } from './RudderInfo';

const getScreenDetails = () => {
  const screenDetails = new RudderScreenInfo();

  // Depending on environment within which the code is executing, screen
  // dimensions can be set
  // User agent and locale can be retrieved only for browser
  // When execution is in SSR window will be undefined
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
