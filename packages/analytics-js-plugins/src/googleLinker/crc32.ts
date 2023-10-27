/* eslint-disable no-bitwise */

/**
 * generate crc table
 *
 * @params none
 * @returns array of CRC table
 */

const makeCRCTable = (): number[] => {
  const crcTable = [];
  let c;

  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  return crcTable;
};

/**
 * This is utility function for crc32 algorithm
 *
 * @param {string} str
 * @returns {number} crc32
 */
const crc32 = (str: string): number => {
  const crcTable = makeCRCTable();
  let crc = 0 ^ -1;

  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
  }

  return (crc ^ -1) >>> 0;
};

export { crc32 };
