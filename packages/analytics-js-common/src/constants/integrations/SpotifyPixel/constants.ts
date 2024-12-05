import {
  SPOTIFYPIXEL_NAME as NAME,
  SPOTIFYPIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'SpotifyPixel';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Spotify Pixel': NAME,
  'spotify pixel': NAME,
  SPOTIFY_PIXEL: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  SPOTIFYPIXEL_NAME as NAME,
  SPOTIFYPIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
