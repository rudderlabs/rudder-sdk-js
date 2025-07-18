import {
  LIVECHAT_NAME as NAME,
  LIVECHAT_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'LiveChat';

const CNameMapping = {
  [NAME]: NAME,
  LiveChat: NAME,
  Live_Chat: NAME,
  livechat: NAME,
  'LIVE CHAT': NAME,
  'Live Chat': NAME,
  'live chat': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
