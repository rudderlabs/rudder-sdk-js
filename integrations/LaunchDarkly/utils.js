const createUser = (message, anonymousUsersSharedKey = undefined) => {
  const user = {};
  user.key = message.userId || message.anonymousId;
  const { traits } = message.context;
  if (traits.anonymous !== undefined) {
    user.anonymous = traits.anonymous;
    if (anonymousUsersSharedKey) user.key = anonymousUsersSharedKey;
  }
  if (traits.avatar !== undefined) user.avatar = traits.avatar;
  if (traits.country !== undefined) user.country = traits.country;
  if (traits.custom !== undefined) user.custom = traits.custom;
  if (traits.email !== undefined) user.email = traits.email;
  if (traits.firstName !== undefined) user.firstName = traits.firstName;
  if (traits.ip !== undefined) user.ip = traits.ip;
  if (traits.lastName !== undefined) user.lastName = traits.lastName;
  if (traits.name !== undefined) user.name = traits.name;
  if (traits.privateAttributeNames !== undefined)
    user.privateAttributeNames = traits.privateAttributeNames;
  if (traits.secondary !== undefined) user.secondary = traits.secondary;
  return user;
};

export default createUser;
