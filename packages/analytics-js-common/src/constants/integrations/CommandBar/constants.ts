import {
  COMMANDBAR_NAME as NAME,
  COMMANDBAR_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'CommandBar';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Command Bar': NAME,
  Commandbar: NAME,
  COMMAND_BAR: NAME,
  commandbar: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  COMMANDBAR_NAME as NAME,
  COMMANDBAR_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
