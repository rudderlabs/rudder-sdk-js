import {
  COMMANDBAR_NAME as NAME,
  COMMANDBAR_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'CommandBar';

const CNameMapping = {
  [NAME]: NAME,
  'Command Bar': NAME,
  Commandbar: NAME,
  COMMAND_BAR: NAME,
  commandbar: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
