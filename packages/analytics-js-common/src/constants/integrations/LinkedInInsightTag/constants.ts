import {
  LINKEDIN_INSIGHT_TAG_NAME as NAME,
  LINKEDIN_INSIGHT_TAG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'LinkedInInsightTag';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'LinkedIn Insight Tag': NAME,
  'LinkedIn insight tag': NAME,
  'linkedIn insight tag': NAME,
  Linkedin_insight_tag: NAME,
  LinkedinInsighttag: NAME,
  LinkedinInsightTag: NAME,
  LinkedInInsightTag: NAME,
  Linkedininsighttag: NAME,
  LINKEDININSIGHTTAG: NAME,
  linkedininsighttag: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  LINKEDIN_INSIGHT_TAG_NAME as NAME,
  LINKEDIN_INSIGHT_TAG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
