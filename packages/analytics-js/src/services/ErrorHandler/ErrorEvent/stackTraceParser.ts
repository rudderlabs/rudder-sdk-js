export type ParsedFrame = {
  fileName: string | undefined;
  functionName: string | undefined;
  lineNumber: number | undefined;
  columnNumber: number | undefined;
};

const CHROME_STACK_LINE_RE = /^\s*at /;
const SAFARI_NATIVE_RE = /^(eval@)?(\[native code])?$/;
const DIGITS_RE = /^\d+$/;

function extractLocation(
  urlLike: string | undefined,
): [string | undefined, number | undefined, number | undefined] {
  if (!urlLike?.includes(':')) {
    return [urlLike || undefined, undefined, undefined];
  }
  const normalizedUrlLike =
    urlLike.startsWith('(') && urlLike.endsWith(')') ? urlLike.slice(1, -1) : urlLike;
  // Take up to two trailing all-digit segments as line and column; whatever is left,
  // colons included, is the file. A url keeps its scheme because "//host" is not digits.
  const segments = normalizedUrlLike.split(':');
  const location: number[] = [];
  while (
    segments.length > 1 &&
    location.length < 2 &&
    DIGITS_RE.test(segments[segments.length - 1] as string)
  ) {
    location.unshift(Number(segments.pop()));
  }
  return [segments.join(':') || undefined, location[0], location[1]];
}

function parseV8Line(line: string): ParsedFrame | null {
  if (!CHROME_STACK_LINE_RE.test(line)) {
    return null;
  }
  if (line.includes('(eval ')) {
    line = line
      .replace(/eval code/g, 'eval')
      .replace(/\(eval at [^()]*/g, '')
      .replace(/,.*/, '');
  }
  const sanitized = line
    .replace(/^\s+/, '')
    .replace(/\(eval code/g, '(')
    .replace(/^.*?\s+/, '');
  const parenLoc = / (\(.+\)$)/.exec(sanitized);
  const withoutLoc = parenLoc ? sanitized.replace(parenLoc[0], '') : sanitized;
  const [rawFile, lineNumber, columnNumber] = extractLocation(parenLoc ? parenLoc[1] : sanitized);
  const functionName = (parenLoc && withoutLoc) || undefined;
  const fileName = rawFile === 'eval' || rawFile === '<anonymous>' ? undefined : rawFile;
  return { functionName, fileName, lineNumber, columnNumber };
}

function parseFFSafariLine(line: string): ParsedFrame | null {
  if (SAFARI_NATIVE_RE.test(line)) {
    return null;
  }
  if (line.includes(' > eval')) {
    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
  }
  if (!line.includes('@') && !line.includes(':')) {
    return {
      functionName: line,
      fileName: undefined,
      lineNumber: undefined,
      columnNumber: undefined,
    };
  }
  const atIndex = line.lastIndexOf('@');
  const functionName = atIndex > 0 ? line.slice(0, atIndex) : undefined;
  const [fileName, lineNumber, columnNumber] = extractLocation(line.slice(atIndex + 1));
  return { functionName, fileName, lineNumber, columnNumber };
}

/**
 * Parses an Error object's stack trace into structured frames.
 * Supports V8/Chromium (Chrome, Edge, Node) and SpiderMonkey/WebKit (Firefox, Safari) formats.
 * Throws if the error has no stack property.
 */
export function parseStackTrace(error: Error): ParsedFrame[] {
  if (!error.stack) {
    throw new Error('Cannot parse given Error object');
  }
  const lines = error.stack.split('\n');
  if (lines.some(l => CHROME_STACK_LINE_RE.test(l))) {
    return lines.map(parseV8Line).filter((f): f is ParsedFrame => f !== null);
  }
  return lines.map(parseFFSafariLine).filter((f): f is ParsedFrame => f !== null);
}
