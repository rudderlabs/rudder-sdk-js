/* SDK-6920 feasibility prototype. NOT the SDK implementation.
 * Native storage and Web Locks; only the data/lifecycle fixture is synthetic.
 * No await occurs between the final deadline check and synchronous commit.
 */
window.boot = function boot(options = {}) {
  const key = options.key || 'sdk6920';
  const backend = options.backend || 'localStorage';
  const lockName = key;
  const domain = options.domain || '';
  const gates = new Map();
  const pending = new Map();
  const records = [];
  const callbacks = [];
  const trace = [];
  const flags = {};
  let tail = Promise.resolve();
  let sequence = 0;
  let lastBoundary;

  const copy = value => structuredClone(value);
  const fresh = () => ({ session: 's1', generation: 0, properties: {} });
  const token = value => `${value.session}/${value.generation}`;
  function read() {
    const raw =
      backend === 'cookie'
        ? document.cookie
            .split('; ')
            .find(c => c.startsWith(`${key}=`))
            ?.slice(key.length + 1)
        : localStorage.getItem(key);
    return raw ? JSON.parse(backend === 'cookie' ? decodeURIComponent(raw) : raw) : fresh();
  }
  function write(value) {
    const raw = JSON.stringify(value);
    if (backend === 'cookie') {
      document.cookie = `${key}=${encodeURIComponent(raw)}; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
    } else localStorage.setItem(key, raw);
    if (JSON.stringify(read()) !== raw) throw new Error('write verification failed');
  }
  // Fixture merge only: same object/array-index rules for the tested JSON values.
  function merge(left, right) {
    if (!right || typeof right !== 'object') return copy(right);
    if (Array.isArray(right)) {
      const out = Array.isArray(left) ? copy(left) : [];
      right.forEach((v, i) => {
        out[i] = merge(out[i], v);
      });
      return out;
    }
    const out = left && typeof left === 'object' && !Array.isArray(left) ? copy(left) : {};
    Object.entries(right).forEach(([k, v]) => {
      out[k] = merge(out[k], v);
    });
    return out;
  }
  function gate(name) {
    if (!gates.has(name)) {
      let release;
      const promise = new Promise(resolve => {
        release = resolve;
      });
      gates.set(name, { promise, release });
    }
    return gates.get(name);
  }
  function waitOrAbort(promise, signal) {
    if (signal.aborted) return Promise.reject(signal.reason);
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        cleanup();
        reject(signal.reason);
      };
      const cleanup = () => signal.removeEventListener('abort', onAbort);
      signal.addEventListener('abort', onAbort, { once: true });
      promise.then(
        value => {
          cleanup();
          resolve(value);
        },
        error => {
          cleanup();
          reject(error);
        },
      );
    });
  }
  function enqueue(kind, patch = {}, config = {}) {
    const id = `${++sequence}`;
    const admitted = performance.now();
    const deadline = admitted + (config.budgetMs ?? 60000);
    const baseToken = token(read());
    // A same-tab call after a queued clear depends on that clear's outcome.
    const boundaryDependency = lastBoundary?.pending ? lastBoundary.promise : null;
    const controller = new AbortController();
    let resolveResult;
    const promise = new Promise(resolve => {
      resolveResult = resolve;
    });
    const operation = { id, promise, pending: true, controller };
    pending.set(id, operation);
    if (kind === 'clear' || kind === 'reset') lastBoundary = operation;
    const timings = { queueMs: null, lockMs: null, commitMs: null };
    let timer;
    function finish(status, reason, state) {
      if (!operation.pending) return;
      operation.pending = false;
      clearTimeout(timer);
      const result = { status, ...(reason ? { reason } : {}) };
      const record = { id, kind, ...result, ...timings, totalMs: performance.now() - admitted };
      records.push(record);
      resolveResult({ ...result, token: state ? token(state) : null, record });
      queueMicrotask(() => {
        callbacks.push({ id, ...result });
        try {
          if (config.throwCallback) throw new Error('fixture callback failure');
        } catch {
          flags.callbackErrors = (flags.callbackErrors || 0) + 1;
        }
      });
    }
    timer = setTimeout(
      () => {
        if (!operation.pending) return;
        controller.abort('timeout');
        finish('rejected', 'timeout');
      },
      Math.max(0, deadline - performance.now()),
    );
    const previous = tail;
    const execute = async () => {
      try {
        await waitOrAbort(previous, controller.signal);
        if (!operation.pending) return;
        const boundary = boundaryDependency ? await boundaryDependency : null;
        const expected = boundary?.token || baseToken;
        timings.queueMs = performance.now() - admitted;
        flags[`started:${id}`] = true;
        if (config.beforeLockGate)
          await waitOrAbort(gate(config.beforeLockGate).promise, controller.signal);
        if (!operation.pending) return;
        const lockStart = performance.now();
        await navigator.locks.request(lockName, { signal: controller.signal }, () => {
          timings.lockMs = performance.now() - lockStart;
          if (!operation.pending) return;
          // Test hook deliberately blocks this tab, so the timer task cannot run.
          if (config.blockBeforeCommitMs) {
            const end = performance.now() + config.blockBeforeCommitMs;
            while (performance.now() < end) {
              /* intentional scheduling probe */
            }
          }
          if (performance.now() >= deadline) return finish('rejected', 'timeout');
          const commitStart = performance.now();
          const state = read();
          if (token(state) !== expected) return finish('rejected', 'cancelled');
          const before = JSON.stringify(state);
          const observed = options.trace
            ? Object.fromEntries(Object.entries(state.properties).filter(([k]) => k !== 'padding'))
            : null;
          if (kind === 'clear') {
            state.generation++;
            state.properties = {};
          } else if (kind === 'reset') {
            state.session = config.newSession || 's2';
            state.generation++;
            state.properties = {};
          } else if (kind === 'campaign') state.properties.sessionCampaign = copy(patch);
          else if (kind === 'replace') Object.assign(state.properties, copy(patch));
          else state.properties = merge(state.properties, patch);
          if (performance.now() >= deadline) return finish('rejected', 'timeout');
          write(state);
          if (options.trace)
            trace.push({
              id,
              kind,
              observed,
              written: Object.fromEntries(
                Object.entries(state.properties).filter(([k]) => k !== 'padding'),
              ),
            });
          timings.commitMs = performance.now() - commitStart;
          finish(JSON.stringify(state) === before ? 'unchanged' : 'applied', undefined, state);
          if (config.blockAfterCommitMs) {
            const end = performance.now() + config.blockAfterCommitMs;
            while (performance.now() < end) {
              /* commit already has a final result */
            }
          }
        });
      } catch (error) {
        // Never call an uncertain post-write failure a confirmed rejection.
        if (operation.pending)
          finish(
            controller.signal.aborted ? 'rejected' : 'unresolved',
            controller.signal.aborted ? 'timeout' : 'unverified_storage_outcome',
          );
      }
    };
    void execute();
    // An early timeout of this operation must not let an event skip older work.
    tail = Promise.all([previous, promise]).then(() => undefined);
    return { id };
  }
  function event() {
    const admitted = performance.now();
    const result = tail.then(() => ({
      properties: copy(read().properties),
      eventDelayMs: performance.now() - admitted,
    }));
    tail = result;
    return result;
  }
  function unsafeLocked(patch, gateName) {
    return navigator.locks.request(lockName, async () => {
      const state = read();
      flags[gateName] = true;
      await gate(gateName).promise;
      Object.assign(state.properties, patch);
      write(state);
      return state;
    });
  }
  window.lab = {
    read,
    write,
    fresh,
    token,
    records,
    callbacks,
    trace,
    flags,
    enqueue,
    event,
    result: id => pending.get(id).promise,
    release: name => gate(name).release(),
    seed: properties => write({ ...fresh(), properties: properties || {} }),
    hold: name => {
      const result = navigator.locks.request(lockName, async () => {
        flags[name] = true;
        await gate(name).promise;
      });
      return { started: true, result };
    },
    unsafeLocked,
    naiveSnapshot: patch => {
      const state = read();
      Object.assign(state.properties, patch);
      return state;
    },
    clearMetrics: () => {
      records.length = 0;
      callbacks.length = 0;
    },
    capabilities: {
      locks: !!navigator.locks,
      secure: isSecureContext,
      origin: location.origin,
      backend,
    },
  };
  return window.lab.capabilities;
};
