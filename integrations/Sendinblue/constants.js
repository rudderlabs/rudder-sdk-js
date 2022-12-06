const NAME = "SENDINBLUE";
const CNameMapping = {
  [NAME]: NAME,
  Sendinblue: NAME,
  sendinblue: NAME,
};

const excludeReservedTraits = [
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "phone",
  "Phone",
  "email",
];

const excludePageProperties = ["url", "title", "path", "referrer"];

export { NAME, CNameMapping, excludeReservedTraits, excludePageProperties };
