export type AppInfo = {
  readonly name: string;
  readonly version: string;
  readonly namespace: string;
  readonly installType: string;
};

export type LibraryInfo = {
  readonly name: string;
  readonly version: string;
  readonly snippetVersion?: string;
  readonly variant?: string;
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

// Local copy of the ambient `user-agent-data-types` shape so the published types don't need that package
export type UABrandVersion = {
  readonly brand: string;
  readonly version: string;
};

export type UADataValues = {
  readonly brands?: UABrandVersion[];
  readonly mobile?: boolean;
  readonly platform?: string;
  readonly architecture?: string;
  readonly bitness?: string;
  readonly formFactors?: string[];
  readonly model?: string;
  readonly platformVersion?: string;
  /** @deprecated in favour of fullVersionList */
  readonly uaFullVersion?: string;
  readonly fullVersionList?: UABrandVersion[];
  readonly wow64?: boolean;
};
