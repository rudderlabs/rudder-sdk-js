import { sanitizeName, sanitizeAttributes } from '../../../src/integrations/VWO/utils';

describe('VWO utilities tests', () => {
  describe('Sanitize Names', () => {
    it('should trim and add the rudder prefix to the event name', () => {
      const name1 = 'abcd';
      const name2 = ' abcd ';

      const expectedName = 'rudder.abcd';

      const result1 = sanitizeName(name1);
      const result2 = sanitizeName(name2);

      expect(result1).toEqual(expectedName);
      expect(result2).toEqual(expectedName);
    });
  });

  describe('Sanitize Attributes', () => {
    it('should sanitize all the keys of the traits object', () => {
      const attributes = {
        companySize: 100,
        companyName: 'RudderStack',
      };

      const expectedAttributes = {
        'rudder.companySize': 100,
        'rudder.companyName': 'RudderStack',
      };

      const result = sanitizeAttributes(attributes);

      expect(result).toEqual(expectedAttributes);
    });
  });
});
