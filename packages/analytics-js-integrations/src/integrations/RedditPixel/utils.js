import sha256 from 'crypto-js/sha256';
import {
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullAndEmptyValues,
} from '../../utils/commonUtils';

const isAppleFamily = platform => {
  const appleOsNames = ['ios', 'watchos', 'ipados', 'tvos'];
  if (typeof platform === 'string') {
    return appleOsNames.includes(platform?.toLowerCase());
  }
  return false;
};

const createUserIdentifier = (traits = {}, context = {}) => {
  const userIdentifier = {};
  const { email, externalId, idfa, aaid } = traits;
  if (isDefinedAndNotNullAndNotEmpty(email)) {
    userIdentifier.email = sha256(email).toString();
  }
  if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    userIdentifier.externalId = sha256(externalId).toString();
  }
  if (isAppleFamily(context.os?.name)) {
    const tempIdfa = idfa || context.device?.advertisingId;
    if (isDefinedAndNotNullAndNotEmpty(tempIdfa)) {
      userIdentifier.idfa = sha256(tempIdfa).toString();
    }
  }
  if (context.os?.name === 'android') {
    const tempAaid = aaid || context.device?.advertisingId;
    if (isDefinedAndNotNullAndNotEmpty(tempAaid)) {
      userIdentifier.aaid = sha256(tempAaid).toString();
    }
  }
  return removeUndefinedAndNullAndEmptyValues(userIdentifier);
};

const verifySignUpMapped = eventMappingFromConfig =>
  eventMappingFromConfig.some(map => map.to === 'SignUp');

export { createUserIdentifier, verifySignUpMapped, isAppleFamily };
