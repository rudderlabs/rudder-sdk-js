import { DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);
logger.setLogLevel('warn');

const MOENGAGE_DATA_CENTER_MAP = {
  US: 'dc_1',
  EU: 'dc_2',
  IND: 'dc_3',
  'US-DC-04': 'dc_4',
  'SGP-DC-05': 'dc_5',
  'IDN-DC-06': 'dc_6',
};

export function calculateMoeDataCenter(region) {
  if (!region) {
    return 'dc_1';
  }

  if (Object.prototype.hasOwnProperty.call(MOENGAGE_DATA_CENTER_MAP, region)) {
    return MOENGAGE_DATA_CENTER_MAP[region];
  }

  logger.warn(`Unrecognized MoEngage region "${region}". Defaulting to dc_1.`);
  return 'dc_1';
}
