import { cookie } from '../src/component-cookie';
import type { Nullable } from '../src/types/Nullable';
import type { IStorage } from '../src/types/Store';
import store from 'storejs';

class LocalStorage implements IStorage {
  keys = () => {
    return store.keys();
  };
  isEnabled = true;
  getItem = (key: string) => {
    return store.get(key) ?? null;
  };
  setItem = (key: string, value: any) => {
    store.set(key, value);
  };
  removeItem = (key: string) => store.remove(key);
  clear = () => {
    store.clear();
  };
  length = store.len();
  key = (idx: number): Nullable<string> => {
    return this.keys()[idx] ?? null;
  };
}

/**
 * A storage utility to retain values in memory via Storage interface
 */
class InMemoryStorage implements IStorage {
  isEnabled = true;
  length = 0;
  data: Record<string, any> = {};

  setItem(key: string, value: any): any {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
    return value;
  }

  getItem(key: string): any {
    if (key in this.data) {
      return this.data[key];
    }
    return null;
  }

  removeItem(key: string) {
    if (key in this.data) {
      delete this.data[key];
    }
    this.length = Object.keys(this.data).length;
    return null;
  }

  clear() {
    this.data = {};
    this.length = 0;
  }

  key(index: number): Nullable<string> {
    const curKeys = this.keys();
    return curKeys[index] ?? null;
  }

  keys(): string[] {
    return Object.keys(this.data);
  }
}

class CookieStorage implements IStorage {
  keys = () => {
    return Object.keys(cookie());
  };

  isEnabled = true;

  getItem = (key: string) => {
    const value = cookie(key);
    return value ?? null;
  };

  setItem = (key: string, value: any) => {
    cookie(key, value);
    this.length = Object.keys(cookie()).length;
  };

  removeItem = (key: string) => {
    const result = this.setItem(key, null);
    this.length = Object.keys(cookie()).length;
    return result;
  };

  clear = () => {
    // Not implemented
  };

  length = Object.keys(cookie()).length;

  key = (idx: number): Nullable<string> => {
    const curKeys = this.keys();
    return curKeys[idx] ?? null;
  };
}

const defaultCookieStorage = new CookieStorage();

export { CookieStorage, defaultCookieStorage };

const defaultInMemoryStorage = new InMemoryStorage();

export { InMemoryStorage, defaultInMemoryStorage };

const defaultLocalStorage = new LocalStorage();

export { LocalStorage, defaultLocalStorage };
