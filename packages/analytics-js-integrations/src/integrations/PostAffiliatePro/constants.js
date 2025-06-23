import {
  POST_AFFILIATE_PRO_NAME as NAME,
  POST_AFFILIATE_PRO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'PostAffiliatePro';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
