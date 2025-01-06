import { HEAP_NAME as NAME, HEAP_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Heap';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Heap: NAME,
  heap: NAME,
  'Heap.io': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
