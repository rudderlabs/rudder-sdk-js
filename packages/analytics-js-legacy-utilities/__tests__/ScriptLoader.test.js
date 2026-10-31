import { ScriptLoader } from '../src/ScriptLoader';
import { LOAD_ORIGIN } from '../src/constants';

describe('ScriptLoader', () => {
  let inserted;
  let insertBefore;
  beforeEach(() => {
    insertBefore = jest.spyOn(document.head, 'insertBefore').mockImplementation(node => {
      expect(node.isConnected).toBe(false);
      inserted = node;
      return node;
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    document.getElementById('existing')?.remove();
  });

  it('sets SRI before insertion', () => {
    ScriptLoader('vendor', 'https://vendor.example/sdk.js', {
      integrity: 'sha384-test',
      crossOrigin: 'anonymous',
    });
    expect(inserted.integrity).toBe('sha384-test');
    expect(inserted.crossOrigin).toBe('anonymous');
    expect(inserted.async).toBe(true);
    expect(inserted.getAttribute('data-loader')).toBe(LOAD_ORIGIN);
    ScriptLoader('cors', 'https://vendor.example/sdk.js', { crossOrigin: 'use-credentials' });
    expect(inserted.crossOrigin).toBe('use-credentials');
    ScriptLoader('default-cors', 'https://vendor.example/sdk.js', { integrity: 'sha384-test' });
    expect(inserted.crossOrigin).toBe('anonymous');
  });

  it('preserves legacy defaults and duplicate ids', () => {
    ScriptLoader('legacy', 'https://vendor.example/sdk.js', {
      async: false,
      skipDatasetAttributes: true,
    });
    expect(inserted.hasAttribute('integrity')).toBe(false);
    expect(inserted.hasAttribute('crossorigin')).toBe(false);
    expect(inserted.async).toBe(false);
    expect(inserted.hasAttribute('data-loader')).toBe(false);
    const existing = document.createElement('script');
    existing.id = 'existing';
    document.head.appendChild(existing);
    insertBefore.mockClear();
    ScriptLoader('existing', 'https://vendor.example/replacement.js', { integrity: 'sha384-test' });
    expect(insertBefore).not.toHaveBeenCalled();
  });

  it('sets SRI on the no-head insertion path', () => {
    const parent = document.createElement('div');
    const anchor = document.createElement('script');
    parent.appendChild(anchor);
    jest
      .spyOn(document, 'getElementsByTagName')
      .mockImplementation(tag => (tag === 'head' ? [] : [anchor]));
    const fallback = jest.spyOn(parent, 'insertBefore').mockImplementation(node => {
      expect(node.isConnected).toBe(false);
      expect(node.integrity).toBe('sha384-test');
      expect(node.crossOrigin).toBe('anonymous');
      expect(node.getAttribute('data-isNonNativeSDK')).toBe('true');
      return node;
    });
    ScriptLoader('fallback', 'https://vendor.example/sdk.js', {
      integrity: 'sha384-test',
      isNonNativeSDK: true,
    });
    expect(fallback).toHaveBeenCalledTimes(1);
  });
});
