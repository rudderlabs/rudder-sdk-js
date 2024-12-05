import {
  POST_AFFILIATE_PRO_NAME as NAME,
  POST_AFFILIATE_PRO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'PostAffiliatePro';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  PostAffiliatePro: NAME,
  Post_affiliate_pro: NAME,
  'Post Affiliate Pro': NAME,
  'Post affiliate pro': NAME,
  'post affiliate pro': NAME,
  postaffiliatepro: NAME,
  POSTAFFILIATEPRO: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  POST_AFFILIATE_PRO_NAME as NAME,
  POST_AFFILIATE_PRO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
