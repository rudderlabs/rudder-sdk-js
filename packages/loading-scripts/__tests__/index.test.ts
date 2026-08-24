describe('loading snippet custom context methods', () => {
  beforeEach(() => {
    jest.resetModules();
    window.rudderanalytics = undefined;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('queues mutating custom context calls before the SDK loads', async () => {
    await import('../src');

    expect(window.rudderanalytics).toEqual(expect.any(Array));
    expect(window.rudderanalytics?.setCustomContext).toEqual(expect.any(Function));
    expect(window.rudderanalytics?.clearCustomContext).toEqual(expect.any(Function));
    expect(window.rudderanalytics?.getCustomContext).toBeUndefined();

    window.rudderanalytics?.setCustomContext({ region: 'EU' });
    window.rudderanalytics?.clearCustomContext();

    expect((window.rudderanalytics as unknown as unknown[]).slice(-2)).toEqual([
      ['setCustomContext', { region: 'EU' }],
      ['clearCustomContext'],
    ]);
  });
});
