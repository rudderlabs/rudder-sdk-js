const DIR_NAME = 'DCMFloodlight';
const NAME = 'DCM_FLOODLIGHT';
const DISPLAY_NAME = 'DCM Floodlight';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
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

export { NAME, CNameMapping, GTAG, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
