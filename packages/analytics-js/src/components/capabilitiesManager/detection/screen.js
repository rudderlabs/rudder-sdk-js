const getScreenDetails = () => {
  let screenDetails = {
    density: 0,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  };
  screenDetails = {
    width: globalThis.screen.width,
    height: globalThis.screen.height,
    density: globalThis.devicePixelRatio,
    innerWidth: globalThis.innerWidth,
    innerHeight: globalThis.innerHeight,
  };
  return screenDetails;
};
export { getScreenDetails };
