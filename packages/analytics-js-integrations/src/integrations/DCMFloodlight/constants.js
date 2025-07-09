import {
  DCM_FLOODLIGHT_NAME as NAME,
  DCM_FLOODLIGHT_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'DCMFloodlight';

const CNameMapping = {
  [NAME]: NAME,
  'DCM Floodlight': NAME,
  'dcm floodlight': NAME,
  'Dcm Floodlight': NAME,
  DCMFloodlight: NAME,
  dcmfloodlight: NAME,
  DcmFloodlight: NAME,
  dcm_floodlight: NAME,
  DCM_Floodlight: NAME,
};
const GTAG = 'globalSiteTag';

export { NAME, CNameMapping, GTAG, DISPLAY_NAME, DIR_NAME };
