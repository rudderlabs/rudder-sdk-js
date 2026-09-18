import { DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);
logger.setLogLevel('warn');

const DEFAULT_MOENGAGE_DATA_CENTER = 'dc_1';

const MOENGAGE_DATA_CENTER_MAP = {
  US: 'dc_1',
  EU: 'dc_2',
  IN: 'dc_3',
  IND: 'dc_3',
  'US-DC-04': 'dc_4',
  'SGP-DC-05': 'dc_5',
  'IDN-DC-06': 'dc_6',
};

export function calculateMoeDataCenter(region) {
  if (!region) {
    return DEFAULT_MOENGAGE_DATA_CENTER;
  }

  if (Object.keys(MOENGAGE_DATA_CENTER_MAP).includes(region)) {
    return MOENGAGE_DATA_CENTER_MAP[region];
  }

  logger.warn(`Unrecognized region "${region}". Defaulting to dc_1.`);
  return DEFAULT_MOENGAGE_DATA_CENTER;
}
