const DIR_NAME = 'PostAffiliatePro';
const NAME = 'POST_AFFILIATE_PRO';
const DISPLAY_NAME = 'Post Affiliate Pro';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
