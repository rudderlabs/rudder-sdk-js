import { loadNativeSdk } from '../../../src/integrations/Wingify/nativeSdkLoader';

describe('Wingify loadNativeSdk', () => {
  const originalDocumentUrl = document.URL;
  const originalGetEntriesByName = performance.getEntriesByName;

  beforeEach(() => {
    delete window._wingify_code;
    document.head.innerHTML = '';
    Object.defineProperty(document, 'URL', {
      configurable: true,
      value: 'https://www.test-host.com',
    });
    performance.getEntriesByName = jest.fn().mockReturnValue([]);
  });

  afterEach(() => {
    if (window._settings_timer) {
      clearTimeout(window._settings_timer);
      delete window._settings_timer;
    }
    localStorage.clear();
    delete window._wingify_code;
    document.head.innerHTML = '';
    Object.defineProperty(document, 'URL', {
      configurable: true,
      value: originalDocumentUrl,
    });
    performance.getEntriesByName = originalGetEntriesByName;
  });

  test('should short-circuit when __wingify_disable__ is present in the URL', () => {
    Object.defineProperty(document, 'URL', {
      configurable: true,
      value: 'https://www.test-host.com?__wingify_disable__',
    });

    loadNativeSdk('654331', 2000);

    expect(window._wingify_code).toBeUndefined();
  });

  test('should not inject hide style when first-contentful-paint is available', () => {
    performance.getEntriesByName = jest
      .fn()
      .mockReturnValue([{ name: 'first-contentful-paint' }]);

    loadNativeSdk('654331', 2000);

    expect(document.getElementById('_vis_opt_path_hides')).toBeNull();
    expect(window._wingify_code).toBeDefined();
  });

  test('should inject hide style when first-contentful-paint is not available', () => {
    loadNativeSdk('654331', 2000);

    const hideStyle = document.getElementById('_vis_opt_path_hides');
    expect(hideStyle).not.toBeNull();
    expect(hideStyle.textContent).toContain('body{');
    expect(window._wingify_code).toBeDefined();
  });

  test('lets stored SmartCode config override the default tolerance and hide element', () => {
    localStorage.setItem(
      '_wingify_654331_config',
      JSON.stringify({ sT: 50, hE: 'html', hES: 'opacity:0 !important;' }),
    );

    loadNativeSdk('654331', 2000);

    expect(window._wingify_code.settings_tolerance()).toBe(50);
    expect(window._wingify_code.hide_element()).toBe('html');
    expect(document.getElementById('_vis_opt_path_hides').textContent).toContain('html{');
  });

  test('keeps defaults when stored SmartCode config is not an object', () => {
    localStorage.setItem('_wingify_654331_config', 'null');

    loadNativeSdk('654331', 2000);

    expect(window._wingify_code.settings_tolerance()).toBe(2000);
    expect(window._wingify_code.hide_element()).toBe('body');
  });
});
