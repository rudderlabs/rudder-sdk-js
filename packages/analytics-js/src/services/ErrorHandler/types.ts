export type ErrorState = {
  severity: string;
  unhandled: boolean;
  severityReason: { type: string };
};

export type EventTarge = {
  localName?: string;
  dataset?: { loader?: string; isnonnativesdk?: string };
  src?: string;
  id?: string;
};
