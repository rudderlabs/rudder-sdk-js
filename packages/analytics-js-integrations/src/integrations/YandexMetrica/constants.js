import {
  YANDEX_METRICA_NAME as NAME,
  YANDEX_METRICA_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'YandexMetrica';

const CNameMapping = {
  [NAME]: NAME,
  Yandexmetrica: NAME,
  yandexmetrica: NAME,
  yandexMetrica: NAME,
  YandexMetrica: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
