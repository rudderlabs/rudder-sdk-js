import { AM_NAME as NAME, AM_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Amplitude';
const AMPLITUDE_SDK_VERSION_CONFIG_KEY = 'apiVersion';
const AMPLITUDE_SDK_V1 = 'v1';
const AMPLITUDE_SDK_V2 = 'v2';
const AMPLITUDE_V1_SDK_URL = 'https://cdn.amplitude.com/libs/analytics-browser-1.9.1-min.js.gz';
const AMPLITUDE_V2_SDK_URL = 'https://cdn.amplitude.com/libs/analytics-browser-2.32.0-min.js.gz';
const AMPLITUDE_V1_SDK_INTEGRITY =
  'sha384-TPZhteUkZj8CAyBx+GZZytBdkuKnhKsSKcCoVCq0QSteWf/Kw5Kb9oVFUROLE1l3';
const AMPLITUDE_V2_SDK_INTEGRITY =
  'sha384-hZ3s3uB8PfU4QYbgXXtU9kEy7lt8i7kRKIWzbVjnS//GQSyv42iEVDEniwLASsSh';

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
  AMPLITUDE_V1_SDK_URL,
  AMPLITUDE_V2_SDK_URL,
  AMPLITUDE_V1_SDK_INTEGRITY,
  AMPLITUDE_V2_SDK_INTEGRITY,
};
