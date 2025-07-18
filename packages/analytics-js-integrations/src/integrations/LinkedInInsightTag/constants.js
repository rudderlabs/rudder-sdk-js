import {
  LINKEDIN_INSIGHT_TAG_NAME as NAME,
  LINKEDIN_INSIGHT_TAG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'LinkedInInsightTag';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
