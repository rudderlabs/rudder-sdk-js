import {
  processCompanyField,
  processIdentityVerificationProps,
  processNameField,
} from '../../../src/integrations/INTERCOM/utils';

describe('processIdentityVerificationProps', () => {
  it('should return payload after populating identity verification props', () => {
    const props = { user_hash: '9c56cc51b374c3ba189210d5b6d4bf57790d351c96c47c02190ecf1e430635ab' };
    const result = processIdentityVerificationProps(props);
    expect(result).toEqual({
      user_hash: '9c56cc51b374c3ba189210d5b6d4bf57790d351c96c47c02190ecf1e430635ab',
    });
  });
});

describe('processCompanyField', () => {
  it('should return the company obj after taking the companyField and company_id should have the value of id', () => {
    const companyField = {
      id: 'group01',
      name: 'Tech Group',
      remove: true,
    };
    const result = processCompanyField(companyField);
    expect(result).toEqual({ company_id: 'group01', name: 'Tech Group', remove: true });
  });

  it('should return the company obj after taking the companyField and company_id should have the value of md5 hashed name', () => {
    const companyField = {
      name: 'Techno Group',
      remove: true,
    };
    const result = processCompanyField(companyField);
    expect(result).toEqual({
      company_id: 'ea0331050f91c1aa1b0be9a8727b1eb9',
      name: 'Techno Group',
      remove: true,
    });
  });

  it('should return the company obj after taking the companyField and company_id should have the value of md5 hashed name', () => {
    const companyField = 'Techno X Group';
    const result = processCompanyField(companyField);
    expect(result).toEqual({
      company_id: '8dbae98a998da9e706b1506ca920e5a5',
    });
  });
});

describe('processNameField', () => {
  it('should return the combination of firstName and lastName if both are present & name not present', () => {
    const traits = {
      firstName: 'Chris',
      lastName: 'Evans ',
    };
    const result = processNameField(traits);
    expect(result).toEqual('Chris Evans');
  });

  it('should return the name if name is present', () => {
    const traits = {
      firstName: 'Chris',
      lastName: 'Evans ',
      name: 'Alex Chriss',
    };
    const result = processNameField(traits);
    expect(result).toEqual('Alex Chriss');
  });
});
