import { AM_NAME as NAME, AM_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Amplitude';
const AMPLITUDE_SDK_VERSION_CONFIG_KEY = 'sdkVersion';
const AMPLITUDE_SDK_V1 = 1;
const AMPLITUDE_SDK_V2 = 2;

const CNameMapping = {
  [NAME]: NAME,
  AMPLITUDE: NAME,
  Amplitude: NAME,
  am: NAME,
};

export {
  NAME,
  CNameMapping,
  DISPLAY_NAME,
  DIR_NAME,
  AMPLITUDE_SDK_VERSION_CONFIG_KEY,
  AMPLITUDE_SDK_V1,
  AMPLITUDE_SDK_V2,
};
