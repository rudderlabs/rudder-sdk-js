import { LIVECHAT_NAME as NAME, LIVECHAT_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'LiveChat';

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

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { LIVECHAT_NAME as NAME, LIVECHAT_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
