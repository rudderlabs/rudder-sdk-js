import {
  MICROSOFT_CLARITY_NAME as NAME,
  MICROSOFT_CLARITY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'MicrosoftClarity';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Microsoft Clarity': NAME,
  'Microsoft clarity': NAME,
  'microsoft clarity': NAME,
  Microsoft_clarity: NAME,
  MicrosoftClarity: NAME,
  MICROSOFTCLARITY: NAME,
  microsoftclarity: NAME,
  microsoftClarity: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  MICROSOFT_CLARITY_NAME as NAME,
  MICROSOFT_CLARITY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
