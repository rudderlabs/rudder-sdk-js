import './styles.css';
import {
  initializeGuidesAndSurveys,
  type IntegrationConfig,
  type IntegrationResult,
  type IntegrationStep,
  type StepStatus,
} from './integration';

const config: IntegrationConfig = {
  amplitudeApiKey: import.meta.env.VITE_AMPLITUDE_API_KEY?.trim() ?? '',
  configUrl: import.meta.env.VITE_RUDDERSTACK_CONFIG_URL?.trim() || undefined,
  dataPlaneUrl: import.meta.env.VITE_RUDDERSTACK_DATA_PLANE_URL?.trim() ?? '',
  writeKey: import.meta.env.VITE_RUDDERSTACK_WRITE_KEY?.trim() ?? '',
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('App root was not found.');
}

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="Signal Studio home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Signal Studio</span>
      </a>
      <div class="integration-pill" id="integration-pill" data-status="loading">
        <span class="pulse" aria-hidden="true"></span>
        <span id="integration-label">Connecting integrations</span>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Feature adoption workspace</p>
          <h1>Turn product signals into better moments.</h1>
          <p class="hero-description">
            This sample workspace sends a realistic customer journey through RudderStack. Amplitude
            Guides &amp; Surveys can use the same events and identity to deliver targeted in-product
            experiences.
          </p>
          <div class="hero-actions">
            <button class="button button-primary" data-action="enter" disabled>
              Start the demo journey
              <span aria-hidden="true">↗</span>
            </button>
            <a class="button button-quiet" href="#developer-view">View integration details</a>
          </div>
        </div>

        <div class="signal-card" aria-label="Live journey summary">
          <div class="signal-card-header">
            <span>Live journey</span>
            <span class="live-label"><i></i> Listening</span>
          </div>
          <div class="signal-visual" aria-hidden="true">
            <div class="orb orb-one"></div>
            <div class="orb orb-two"></div>
            <div class="signal-line line-one"></div>
            <div class="signal-line line-two"></div>
            <div class="signal-node node-rs">R</div>
            <div class="signal-node node-am">A</div>
            <span class="signal-caption caption-rs">RudderStack</span>
            <span class="signal-caption caption-am">Amplitude</span>
          </div>
          <div class="signal-stats">
            <div><strong id="events-sent">0</strong><span>Signals sent</span></div>
            <div><strong id="content-count">—</strong><span>Experiences ready</span></div>
          </div>
        </div>
      </section>

      <section class="journey-section" aria-labelledby="journey-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Try the flow</p>
            <h2 id="journey-title">A three-step customer journey</h2>
          </div>
          <p>Configure Amplitude content against these events to see it appear in this app.</p>
        </div>

        <div class="journey-grid">
          <article class="journey-card featured">
            <span class="step-number">01</span>
            <div class="card-icon icon-person" aria-hidden="true"></div>
            <h3>Enter the workspace</h3>
            <p>Send a workspace page signal for an anonymous product visitor.</p>
            <button class="text-button" data-action="enter" disabled>
              View workspace <span>→</span>
            </button>
          </article>

          <article class="journey-card">
            <span class="step-number">02</span>
            <div class="card-icon icon-spark" aria-hidden="true">✦</div>
            <h3>Explore a feature</h3>
            <p>Send page and feature-preview events through device mode.</p>
            <button class="text-button" data-action="feature" disabled>
              Preview feature <span>→</span>
            </button>
          </article>

          <article class="journey-card">
            <span class="step-number">03</span>
            <div class="card-icon icon-chat" aria-hidden="true"></div>
            <h3>Ask for feedback</h3>
            <p>Emit a feedback signal that can target an Amplitude survey.</p>
            <button class="text-button" data-action="feedback" disabled>
              Request feedback <span>→</span>
            </button>
          </article>
        </div>
      </section>

      <section class="developer-section" id="developer-view" aria-labelledby="developer-title">
        <div class="developer-intro">
          <p class="eyebrow">Developer view</p>
          <h2 id="developer-title">One identity. One Analytics instance.</h2>
          <p>
            RudderStack initializes Amplitude Browser SDK v2 first. The ready callback then loads
            the project-specific Engagement bundle and adds its plugin to that existing instance.
          </p>
          <pre><code>rudderanalytics.ready(async () =&gt; {
  await loadScript(
    \`https://cdn.amplitude.com/script/\${API_KEY}.engagement.js\`,
  );

  await amplitude.add(window.engagement.plugin()).promise;
});</code></pre>
        </div>

        <div class="diagnostics-card">
          <div class="diagnostics-header">
            <div>
              <span class="diagnostics-kicker">Runtime diagnostics</span>
              <strong id="diagnostics-title">Initializing…</strong>
            </div>
            <button class="icon-button" id="copy-diagnostics" type="button" aria-label="Copy diagnostics">
              <span aria-hidden="true">⧉</span>
            </button>
          </div>

          <ol class="status-list">
            <li data-step="rudderstack" data-status="loading">
              <span class="status-indicator"></span>
              <div><strong>RudderStack CDN</strong><span data-detail>Loading production v3 bundle</span></div>
            </li>
            <li data-step="amplitude" data-status="waiting">
              <span class="status-indicator"></span>
              <div><strong>Amplitude Analytics</strong><span data-detail>Waiting for device mode</span></div>
            </li>
            <li data-step="engagement" data-status="waiting">
              <span class="status-indicator"></span>
              <div><strong>Guides &amp; Surveys</strong><span data-detail>Waiting for Amplitude</span></div>
            </li>
          </ol>

          <dl class="identity-grid">
            <div><dt>Device ID</dt><dd id="device-id">—</dd></div>
            <div><dt>User ID</dt><dd id="user-id">Not identified</dd></div>
            <div><dt>Session</dt><dd id="session-id">—</dd></div>
            <div><dt>Identity check</dt><dd id="identity-check">Pending</dd></div>
          </dl>

          <div class="activity-log" aria-live="polite">
            <span>Latest activity</span>
            <p id="activity-message">Preparing the sample workspace…</p>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <span>Signal Studio · Integration example</span>
      <span>RudderStack CDN → Amplitude Browser SDK v2 → Engagement plugin</span>
    </footer>
  </div>
`;

const select = <ElementType extends Element>(selector: string): ElementType => {
  const element = document.querySelector<ElementType>(selector);
  if (!element) {
    throw new Error(`Expected element ${selector} was not found.`);
  }
  return element;
};

const integrationPill = select<HTMLDivElement>('#integration-pill');
const integrationLabel = select<HTMLSpanElement>('#integration-label');
const diagnosticsTitle = select<HTMLElement>('#diagnostics-title');
const activityMessage = select<HTMLParagraphElement>('#activity-message');
const eventsSent = select<HTMLElement>('#events-sent');
const contentCount = select<HTMLElement>('#content-count');
const deviceId = select<HTMLElement>('#device-id');
const userId = select<HTMLElement>('#user-id');
const sessionId = select<HTMLElement>('#session-id');
const identityCheck = select<HTMLElement>('#identity-check');
const actionButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-action]')];

let result: IntegrationResult | undefined;
let eventCount = 0;
let finishTest!: (value: IntegrationResult | undefined) => void;

declare global {
  interface Window {
    __AMPLITUDE_GUIDES_SURVEYS_TEST__?: Promise<IntegrationResult | undefined>;
  }
}

window.__AMPLITUDE_GUIDES_SURVEYS_TEST__ = new Promise(resolve => {
  finishTest = resolve;
});

const reportStatus = (step: IntegrationStep, status: StepStatus, detail: string): void => {
  const item = select<HTMLLIElement>(`[data-step="${step}"]`);
  item.dataset.status = status;
  select<HTMLElement>(`[data-step="${step}"] [data-detail]`).textContent = detail;
};

const setActivity = (message: string): void => {
  activityMessage.textContent = message;
};

const recordSignal = (message: string): void => {
  eventCount += 1;
  eventsSent.textContent = String(eventCount);
  setActivity(message);
};

const setActionsEnabled = (enabled: boolean): void => {
  actionButtons.forEach(button => {
    button.disabled = !enabled;
  });
};

const renderIdentity = (): void => {
  if (!result) return;
  const identity = result.identityAfterPlugin;
  deviceId.textContent = identity.deviceId ?? 'Unavailable';
  userId.textContent = window.amplitude?.getUserId() ?? 'Not identified';
  sessionId.textContent = String(identity.sessionId ?? 'Unavailable');
  identityCheck.textContent = result.identityPreserved ? 'Preserved ✓' : 'Changed';
  identityCheck.dataset.preserved = String(result.identityPreserved);
};

const validateConfig = (): string[] => {
  const missing: string[] = [];
  if (!config.writeKey) missing.push('VITE_RUDDERSTACK_WRITE_KEY');
  if (!config.dataPlaneUrl) missing.push('VITE_RUDDERSTACK_DATA_PLANE_URL');
  if (!config.amplitudeApiKey) missing.push('VITE_AMPLITUDE_API_KEY');
  return missing;
};

const initialize = async (): Promise<void> => {
  const missing = validateConfig();
  if (missing.length > 0) {
    integrationPill.dataset.status = 'error';
    integrationLabel.textContent = 'Configuration required';
    diagnosticsTitle.textContent = 'Add the missing environment values';
    reportStatus('rudderstack', 'error', `Missing ${missing.join(', ')}`);
    setActivity('Copy .env.example to .env, complete the values, and restart Vite.');
    finishTest(undefined);
    return;
  }

  try {
    result = await initializeGuidesAndSurveys(config, reportStatus);
    integrationPill.dataset.status = 'ready';
    integrationLabel.textContent = 'Guides & Surveys ready';
    diagnosticsTitle.textContent = `Connected with Amplitude ${result.sdkVersion}`;
    contentCount.textContent = String(result.contentCount);
    renderIdentity();
    setActionsEnabled(true);
    setActivity('Integration ready. Start the demo journey to send a customer signal.');

    finishTest(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    integrationPill.dataset.status = 'error';
    integrationLabel.textContent = 'Integration needs attention';
    diagnosticsTitle.textContent = 'Initialization failed';
    setActivity(message);
    finishTest(undefined);
  }
};

const enterWorkspace = (): void => {
  if (!result) return;
  result.analytics.page(
    'Workspace',
    'Workspace Home',
    {
      path: '/workspace',
      title: 'Signal Studio Workspace',
    },
    () => recordSignal('Workspace Home was sent through RudderStack device mode.'),
  );
};

const previewFeature = (): void => {
  if (!result) return;
  result.analytics.page('Workspace', 'Feature Lab', {
    path: '/workspace/feature-lab',
    title: 'Signal Studio Feature Lab',
  });
  result.analytics.track(
    'Feature Previewed',
    { feature: 'Audience Signals', source: 'integration-example' },
    () => recordSignal('Feature Previewed was sent through RudderStack device mode.'),
  );
};

const requestFeedback = (): void => {
  if (!result) return;
  result.analytics.track(
    'Feedback Requested',
    { placement: 'feature-adoption-workspace', topic: 'onboarding' },
    () => recordSignal('Feedback Requested was sent and can be used to target a survey.'),
  );
};

actionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'enter') enterWorkspace();
    if (action === 'feature') previewFeature();
    if (action === 'feedback') requestFeedback();
  });
});

select<HTMLButtonElement>('#copy-diagnostics').addEventListener('click', async () => {
  if (!result) {
    setActivity('Diagnostics are available after the integration initializes.');
    return;
  }

  try {
    await navigator.clipboard.writeText(
      JSON.stringify(
        {
          contentCount: result.contentCount,
          identityAfterPlugin: result.identityAfterPlugin,
          identityBeforePlugin: result.identityBeforePlugin,
          identityPreserved: result.identityPreserved,
          sdkVersion: result.sdkVersion,
        },
        null,
        2,
      ),
    );
    setActivity('Runtime diagnostics copied to the clipboard.');
  } catch {
    setActivity('Clipboard access was unavailable. Inspect the test result from the console.');
  }
});

void initialize();
