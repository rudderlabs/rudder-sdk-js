import md5 from 'md5';
/**
 * Returns payload
 * @param {*} props
 * @returns
 */
const processIdentityVerificationProps = props => {
  const payload = {};
  if (props) {
    const userHash = props.user_hash || null;
    if (userHash) {
      payload.user_hash = userHash;
    }

    const hideDefaultLauncher = props.hideDefaultLauncher || null;
    if (hideDefaultLauncher) {
      payload.hide_default_launcher = hideDefaultLauncher;
    }
  }

  return payload;
};

/**
 * Returns company payload
 * @param {*} companyField
 * @returns
 */
const processCompanyField = companyField => {
  const company = {};
  if (typeof companyField === 'string') {
    company.company_id = md5(companyField);
  }

  const companyFields = typeof companyField === 'object' ? Object.keys(companyField) : [];
  companyFields.forEach(key => {
    if (key !== 'id') {
      company[key] = companyField[key];
    } else {
      company.company_id = companyField[key];
    }
  });

  if (typeof companyField === 'object' && !companyFields.includes('id')) {
    company.company_id = md5(company.name);
  }

  return company;
};

/**
 * Returns name parameter
 * @param {*} traits
 * @returns
 */
const processNameField = traits => {
  const { firstName, lastName, name } = traits;
  /**
   * populate name if firstName and lastName is populated
   * if name is not set
   */
  if (!name && (firstName || lastName)) {
    return `${firstName} ${lastName}`.trim();
  }
  return name;
};

export { processNameField, processCompanyField, processIdentityVerificationProps };
