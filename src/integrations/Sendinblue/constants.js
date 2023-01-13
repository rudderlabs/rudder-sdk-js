const NAME = "SENDINBLUE";
const CNameMapping = {
  [NAME]: NAME,
  Sendinblue: NAME,
  sendinblue: NAME,
  SendinBlue: NAME
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
  "Email",
  "E-mail",
];

const excludePageProperties = ["url", "title", "path", "referrer"];

export { NAME, CNameMapping, excludeReservedTraits, excludePageProperties };
