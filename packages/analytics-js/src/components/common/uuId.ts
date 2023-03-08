import { v4 as uuidSecure } from "@lukeed/uuid/secure";
import { v4 as uuid } from "@lukeed/uuid";

const generateUUID = (): string => {
  if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return uuidSecure();
  }

  return uuid();
}

export {
  generateUUID
}
