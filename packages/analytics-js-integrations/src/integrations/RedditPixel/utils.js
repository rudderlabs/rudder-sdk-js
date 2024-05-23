import { removeUndefinedAndNullAndEmptyValues } from '../../utils/commonUtils';
const createUserIdentifier = (traits = {}) => {
  const userIdentifier = {};
  const { email, externalId, idfa, aaid } = traits;
  userIdentifier.email = email;
  userIdentifier.externalId = externalId;
  userIdentifier.idfa = idfa;
  userIdentifier.aaid = aaid;
  return removeUndefinedAndNullAndEmptyValues(userIdentifier);
};

const verifySignUpMapped = eventMappingFromConfig =>
  eventMappingFromConfig.some(map => map.to === 'SignUp');

export { createUserIdentifier, verifySignUpMapped };
