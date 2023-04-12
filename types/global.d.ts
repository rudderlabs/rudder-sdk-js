// @ts-ignore
declare global {
  namespace NodeJS {
    interface Global extends Window {
      document: Document;
      navigator: Navigator;
      [name: string]: any;
    }
  }
}

declare const __BUNDLE_ALL_PLUGINS__: boolean;
