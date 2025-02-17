import { NINETAILED_NAME as NAME, NINETAILED_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Ninetailed';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Ninetailed: NAME,
  ninetailed: NAME,
  NineTailed: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
