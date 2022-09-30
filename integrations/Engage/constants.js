const NAME = 'ENGAGE';
const CNameMapping = {
  [NAME]: NAME,
  Engage: NAME,
};
const identifyExcludeFields = [
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'phone',
];
export { NAME, CNameMapping, identifyExcludeFields };
