import { XPIXEL_NAME as NAME, XPIXEL_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'XPixel';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  XPixel: NAME,
  Xpixel: NAME,
  xpixel: NAME,
  xPixel: NAME,
};

const trackPropertyMapping = [
  {
    destKey: 'event_id',
    sourceKeys: ['properties.eventId', 'properties.event_id', 'messageId'],
  },
  {
    destKey: 'status',
    sourceKeys: 'properties.status',
  },
  {
    destKey: 'currency',
    sourceKeys: 'properties.currency',
  },
  {
    destKey: 'value',
    sourceKeys: 'properties.value',
  },
  {
    destKey: 'search_string',
    sourceKeys: ['properties.search_string', 'properties.searchString'],
  },
  {
    destKey: 'description',
    sourceKeys: 'properties.description',
  },
  {
    destKey: 'conversion_id',
    sourceKeys: ['properties.conversion_id', 'properties.conversionId'],
  },
  {
    destKey: 'twclid',
    sourceKeys: 'properties.twclid',
  },
  {
    destKey: 'contents',
    sourceKeys: 'properties.contents',
  },
];

export {
  NAME,
  CNameMapping,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DISPLAY_NAME,
  DIR_NAME,
  trackPropertyMapping,
};
