import { removeUndefinedAndNullAndEmptyValues } from '../../utils/commonUtils';
const createUserIdentifier = (traits = {}, context = {}) => {
  const userIdentifier = {};
  const { email, externalId, idfa, aaid } = traits;
  userIdentifier.email = email;
  userIdentifier.externalId = externalId;
  if (isAppleFamily(context.os?.name)) {
    userIdentifier.idfa = idfa || context.device?.advertisingId;
  }
  if (context.os?.name === 'android') {
    userIdentifier.aaid = aaid || context.device?.advertisingId;
  }
  return removeUndefinedAndNullAndEmptyValues(userIdentifier);
};

const verifySignUpMapped = eventMappingFromConfig =>
  eventMappingFromConfig.some(map => map.to === 'SignUp');

const isAppleFamily = platform => {
  const appleOsNames = ['ios', 'watchos', 'ipados', 'tvos'];
  if (typeof platform === 'string') {
    return appleOsNames.includes(platform?.toLowerCase());
  }
  return false;
};

export { createUserIdentifier, verifySignUpMapped, isAppleFamily };
