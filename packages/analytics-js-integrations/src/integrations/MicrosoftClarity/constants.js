import {
  MICROSOFT_CLARITY_NAME as NAME,
  MICROSOFT_CLARITY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'MicrosoftClarity';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
