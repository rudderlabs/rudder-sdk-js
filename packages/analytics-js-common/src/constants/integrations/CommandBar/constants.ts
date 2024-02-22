const DIR_NAME = 'CommandBar';
const NAME = 'COMMANDBAR';
const DISPLAY_NAME = 'CommandBar';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Command Bar': NAME,
  'Commandbar': NAME,
  COMMAND_BAR: NAME,
  commandbar: NAME,
};

export {
  NAME,
  CNameMapping,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DISPLAY_NAME,
  DIR_NAME,
};

