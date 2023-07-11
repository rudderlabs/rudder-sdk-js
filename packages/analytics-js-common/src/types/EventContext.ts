export type AppInfo = {
  readonly name: string;
  readonly version: string;
  readonly namespace: string;
};

export type LibraryInfo = {
  readonly name: string;
  readonly version: string;
};

export type OSInfo = {
  readonly name: string;
  readonly version: string;
};

export type ScreenInfo = {
  readonly density: number;
  readonly width: number;
  readonly height: number;
  readonly innerWidth: number;
  readonly innerHeight: number;
};

export type UTMParameters = Record<string, string>;
