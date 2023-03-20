import { CookieOptions } from '@rudderstack/analytics-js/npmPackages/component-cookie';

export type StoreId = 'clientData' | 'eventQueue' | string;
export type StorageType = 'localStorage' | 'sessionStorage' | 'memoryStorage' | 'cookieStorage';
export type CookieSameSite = 'Strict' | 'Lax' | 'None';
export interface IStorage extends Storage {
  configure?: (options: StorageOptions) => void;
  isEnabled?: boolean;
}
export interface ICookieStorageOptions extends CookieOptions {
  samesite?: CookieSameSite;
  enabled?: boolean;
}
export interface ILocalStorageOptions {
  enabled?: boolean;
}
export interface IInMemoryStorageOptions {
  enabled?: boolean;
}
export type StorageOptions = Partial<
  ICookieStorageOptions | ILocalStorageOptions | IInMemoryStorageOptions
>;
