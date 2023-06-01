import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'LIVECHAT';
const DISPLAY_NAME = 'LiveChat';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  LiveChat: NAME,
  Live_Chat: NAME,
  livechat: NAME,
  'LIVE CHAT': NAME,
  'Live Chat': NAME,
  'live chat': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
