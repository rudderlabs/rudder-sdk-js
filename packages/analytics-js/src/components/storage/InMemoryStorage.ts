import { GenericObject } from '@rudderstack/analytics-js/types';

class InMemoryStorage {
  data: GenericObject = {};

  length = 0;

  setItem(key: string, value: any): any {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
    return value;
  }

  getItem(key: string) {
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
    this.data = {} as GenericObject;
    this.length = 0;
  }

  key(index: number): string {
    return Object.keys(this.data)[index];
  }
}

export { InMemoryStorage };
