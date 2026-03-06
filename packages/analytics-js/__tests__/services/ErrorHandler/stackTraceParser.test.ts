import { parseStackTrace } from '../../../src/services/ErrorHandler/ErrorEvent/stackTraceParser';

// Helper to build an Error with a synthetic stack string
const makeError = (stack: string): Error => {
  const e = new Error('test');
  e.stack = stack;
  return e;
};

describe('parseStackTrace', () => {
  describe('throws when stack is missing', () => {
    it('throws for an error with no stack', () => {
      const e = new Error('test');
      e.stack = undefined;
      expect(() => parseStackTrace(e)).toThrow('Cannot parse given Error object');
    });
  });

  describe('V8/Chromium format (Chrome, Edge, Node)', () => {
    it('parses a basic V8 stack with named functions', () => {
      const e = makeError(`Error: test
    at functionOne (file.js:10:5)
    at functionTwo (file2.js:20:3)`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(2);
      expect(frames[0]).toEqual({
        functionName: 'functionOne',
        fileName: 'file.js',
        lineNumber: 10,
        columnNumber: 5,
      });
      expect(frames[1]).toEqual({
        functionName: 'functionTwo',
        fileName: 'file2.js',
        lineNumber: 20,
        columnNumber: 3,
      });
    });

    it('parses a V8 frame without a function name (bare location)', () => {
      const e = makeError(`Error: test
    at file.js:10:5`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]).toMatchObject({ lineNumber: 10, columnNumber: 5 });
    });

    it('parses a V8 stack with a URL containing a port number', () => {
      const e = makeError(`Error: test
    at doThing (http://localhost:8080/app.js:42:7)`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]).toEqual({
        functionName: 'doThing',
        fileName: 'http://localhost:8080/app.js',
        lineNumber: 42,
        columnNumber: 7,
      });
    });

    it('parses a V8 stack with a filename containing parentheses', () => {
      const e = makeError(`Error: test
    at fn (app(legacy).js:10:20)`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]).toMatchObject({
        functionName: 'fn',
        fileName: 'app(legacy).js',
        lineNumber: 10,
        columnNumber: 20,
      });
    });

    it('strips the error message line and only returns at-frames', () => {
      const e = makeError(`Error: something went wrong
    at alpha (a.js:1:1)
    at beta (b.js:2:2)`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(2);
      expect(frames.map(f => f.functionName)).toEqual(['alpha', 'beta']);
    });

    it('maps eval frames: sets fileName to undefined for anonymous eval', () => {
      const e = makeError(`Error: test
    at eval (<anonymous>:1:1)
    at realFn (real.js:5:3)`);

      const frames = parseStackTrace(e);
      // <anonymous> eval frame — fileName should be undefined
      expect(frames[0]?.fileName).toBeUndefined();
      expect(frames[1]).toMatchObject({ functionName: 'realFn', fileName: 'real.js' });
    });

    it('handles (native) frames without crashing', () => {
      const e = makeError(`Error: test
    at Array.forEach (native)
    at run (run.js:3:1)`);

      const frames = parseStackTrace(e);
      expect(frames.length).toBeGreaterThanOrEqual(1);
      expect(frames.some(f => f.fileName === 'run.js')).toBe(true);
    });

    it('returns lineNumber and columnNumber as numbers, not strings', () => {
      const e = makeError(`Error: test
    at fn (file.js:99:12)`);

      const [frame] = parseStackTrace(e);
      expect(typeof frame?.lineNumber).toBe('number');
      expect(typeof frame?.columnNumber).toBe('number');
    });
  });

  describe('SpiderMonkey/WebKit format (Firefox, Safari)', () => {
    it('parses a basic Firefox stack with named functions', () => {
      const e = makeError(`functionOne@file.js:10:5
functionTwo@file2.js:20:3`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(2);
      expect(frames[0]).toEqual({
        functionName: 'functionOne',
        fileName: 'file.js',
        lineNumber: 10,
        columnNumber: 5,
      });
      expect(frames[1]).toEqual({
        functionName: 'functionTwo',
        fileName: 'file2.js',
        lineNumber: 20,
        columnNumber: 3,
      });
    });

    it('parses an anonymous Firefox frame (no function name before @)', () => {
      const e = makeError(`@file.js:10:5`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]).toMatchObject({ fileName: 'file.js', lineNumber: 10, columnNumber: 5 });
    });

    it('filters out native code frames', () => {
      const e = makeError(`fn@file.js:1:1
[native code]
eval@[native code]`);

      const frames = parseStackTrace(e);
      // "[native code]" and "eval@[native code]" should be dropped by SAFARI_NATIVE_RE
      expect(frames).toHaveLength(1);
      expect(frames[0]?.functionName).toBe('fn');
    });

    it('handles a Safari frame that is only a function name (no location)', () => {
      const e = makeError(`onlyFunctionName`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]).toEqual({
        functionName: 'onlyFunctionName',
        fileName: undefined,
        lineNumber: undefined,
        columnNumber: undefined,
      });
    });

    it('normalises eval location in Firefox format', () => {
      // Firefox style: "fn@file.js line 10 > eval:1:1" → "fn@file.js:10"
      const e = makeError(`evalFn@http://host/app.js line 10 > eval:1:1`);

      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]).toMatchObject({ functionName: 'evalFn', fileName: 'http://host/app.js' });
    });

    it('returns lineNumber and columnNumber as numbers', () => {
      const e = makeError(`fn@file.js:42:7`);

      const [frame] = parseStackTrace(e);
      expect(typeof frame?.lineNumber).toBe('number');
      expect(typeof frame?.columnNumber).toBe('number');
    });
  });

  describe('branch selection heuristic', () => {
    it('uses the V8 branch when any line starts with "    at "', () => {
      // Mixed content: first line is a message, second is V8
      const e = makeError(`Error: test\n    at fn (file.js:1:1)`);
      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]?.functionName).toBe('fn');
    });

    it('falls through to FF/Safari branch when no V8 "at" lines are present', () => {
      const e = makeError(`fn@file.js:1:1`);
      const frames = parseStackTrace(e);
      expect(frames).toHaveLength(1);
      expect(frames[0]?.functionName).toBe('fn');
    });
  });
});
