const DIR_NAME = 'MicrosoftClarity';
const NAME = 'MICROSOFT_CLARITY';
const DISPLAY_NAME = 'Microsoft Clarity';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
