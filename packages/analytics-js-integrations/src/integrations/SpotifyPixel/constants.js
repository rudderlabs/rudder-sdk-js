import {
  SPOTIFYPIXEL_NAME as NAME,
  SPOTIFYPIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'SpotifyPixel';

const CNameMapping = {
  [NAME]: NAME,
  'Spotify Pixel': NAME,
  'spotify pixel': NAME,
  SPOTIFY_PIXEL: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
