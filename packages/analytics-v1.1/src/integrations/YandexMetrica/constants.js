import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'YANDEX_METRICA';
const DISPLAY_NAME = 'Yandex.Metrica';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Yandexmetrica: NAME,
  yandexmetrica: NAME,
  yandexMetrica: NAME,
  YandexMetrica: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
