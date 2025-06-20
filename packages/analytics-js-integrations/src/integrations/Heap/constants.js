import { HEAP_NAME as NAME, HEAP_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Heap';

const CNameMapping = {
  [NAME]: NAME,
  Heap: NAME,
  heap: NAME,
  'Heap.io': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
