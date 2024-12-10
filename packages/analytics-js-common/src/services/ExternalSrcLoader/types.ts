export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?(id?: string, error?: Error): void;
  async?: boolean;
  timeout?: number;
  extraAttributes?: Record<string, string>;
}

export interface IExternalSrcLoader {
  loadJSFile(config: IExternalSourceLoadConfig): void;
}
