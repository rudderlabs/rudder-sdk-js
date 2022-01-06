import { isObject } from "../../utils/utils";

const isString = function isString(val) {
  return Object.prototype.toString.call(val) === "[object String]";
};

const createUser = (message) => {
  const user = {};
  user.key = message.userId || message.anonymousId;
  const { traits } = message.context;
  if (traits.anonymous !== undefined) {
    user.anonymous = traits.anonymous;
  }
  if (traits.avatar !== undefined && isString(traits.avatar))
    user.avatar = traits.avatar;
  if (traits.country !== undefined && isString(traits.country))
    user.country = traits.country;
  if (traits.custom !== undefined && isObject(traits.custom))
    user.custom = traits.custom;
  if (traits.email !== undefined && isString(traits.email))
    user.email = traits.email;
  if (traits.firstName !== undefined && isString(traits.firstName))
    user.firstName = traits.firstName;
  if (traits.ip !== undefined && isString(traits.ip)) user.ip = traits.ip;
  if (traits.lastName !== undefined && isString(traits.lastName))
    user.lastName = traits.lastName;
  if (traits.name !== undefined && isString(traits.name))
    user.name = traits.name;
  if (
    traits.privateAttributeNames !== undefined &&
    Array.isArray(traits.privateAttributeNames)
  )
    user.privateAttributeNames = traits.privateAttributeNames;
  if (traits.secondary !== undefined && isString(traits.secondary))
    user.secondary = traits.secondary;
  return user;
};
export default createUser;
