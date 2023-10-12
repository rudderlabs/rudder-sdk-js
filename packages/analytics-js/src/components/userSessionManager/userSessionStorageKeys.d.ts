declare const userSessionStorageKeys: {
  userId: string;
  userTraits: string;
  anonymousId: string;
  groupId: string;
  groupTraits: string;
  initialReferrer: string;
  initialReferringDomain: string;
  sessionInfo: string;
  authToken: string;
};
declare const defaultUserSessionValues: {
  userId: string;
  userTraits: {};
  anonymousId: string;
  groupId: string;
  groupTraits: {};
  initialReferrer: string;
  initialReferringDomain: string;
  sessionInfo: {};
  authToken: null;
};
declare const inMemorySessionKeys: {
  session_id: string;
};
export { userSessionStorageKeys, inMemorySessionKeys, defaultUserSessionValues };
