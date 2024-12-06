import {
  QUANTUMMETRIC_NAME as NAME,
  QUANTUMMETRIC_DISPLAY_NAME as DISPLAY_NAME,
} from '../Destinations';

const DIR_NAME = 'QuantumMetric';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Quantum Metric': NAME,
  'quantum Metric': NAME,
  'quantum metric': NAME,
  QuantumMetric: NAME,
  quantumMetric: NAME,
  quantummetric: NAME,
  Quantum_Metric: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
