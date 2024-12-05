import {
  YANDEX_METRICA_NAME as NAME,
  YANDEX_METRICA_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'YandexMetrica';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Yandexmetrica: NAME,
  yandexmetrica: NAME,
  yandexMetrica: NAME,
  YandexMetrica: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  YANDEX_METRICA_NAME as NAME,
  YANDEX_METRICA_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
