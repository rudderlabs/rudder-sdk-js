# RetryQueue

Provides durable retries with a queue held in `localStorage` (with graceful fallbacks to memory when necessary).

## How It Works

Each page maintains its own list of queued and in-progress tasks, while constantly refreshing its ack time. If a queue goes more than 10s without updating its ack, another page will remove it, claim all queued tasks, and retry all in-progress tasks.

## API

### new RetryQueue(name, [opts], processFunc(item, done(err, res)))

You can omit the `opts` argument to initialize the queue with defaults:

```javascript
var queue = new RetryQueue('my_queue_name', function process(item, done) {
  sendAsync(item, function (err, res) {
    if (err) return done(err);
    done(null, res);
  });
});

queue.start();
```

### Options

The queue can be initialized with the following options (_defaults shown_):

```js
var options = {
  minRetryDelay: 1000,   // min retry delay in ms (used in exp. backoff calcs)
  maxRetryDelay: 30000,  // max retry delay in ms (used in exp. backoff calcs)
  backoffFactor: 2,      // exponential backoff factor (attempts^n)
  backoffJitter: 0,      // jitter factor for backoff calcs (0 is usually fine)
  maxItems: Infinity     // queue high water mark (we suggest 100 as a max)
  maxAttempts: Infinity  // max retry attempts before discarding
};

var queue = new RetryQueue('my_queue_name', options, (item, done) => {
  sendAsync(item, (err, res) => {
    if (err) return done(err);
    done(null, res);
  });
});

queue.start();
```

### .addItem(item)

Adds an item to the queue

```javascript
queue.addItem({ a: 'b' });
```

### .getDelay `(attemptNumber) -> ms`

Can be overridden to provide a custom retry delay in ms. You'll likely want to use the queue instance's backoff constants here.

```js
this.backoff = {
  MIN_RETRY_DELAY: opts.minRetryDelay || 1000,
  MAX_RETRY_DELAY: opts.maxRetryDelay || 30000,
  FACTOR: opts.backoffFactor || 2,
  JITTER: opts.backoffJitter || 0,
};
```

Default implementation:

```javascript
queue.getDelay = function (attemptNumber) {
  var ms = this.backoff.MIN_RETRY_DELAY * Math.pow(this.backoff.FACTOR, attemptNumber);
  if (this.backoff.JITTER) {
    var rand = Math.random();
    var deviation = Math.floor(rand * this.backoff.JITTER * ms);
    if (Math.floor(rand * 10) < 5) {
      ms -= deviation;
    } else {
      ms += deviation;
    }
  }
  return Number(Math.min(ms, this.backoff.MAX_RETRY_DELAY).toPrecision(1));
};
```

### .shouldRetry `(item, attemptNumber, error) -> boolean`

Can be overridden to provide custom logic for whether to requeue the item. You'll likely want to use the queue instance's `maxAttempts` variable (which is overridable via constructor's `opts` argument).

**Default**:

```js
queue.shouldRetry = function (item, attemptNumber, error) {
  if (attemptNumber > this.maxAttempts) return false;
  return true;
};
```

You may also want to selectively retry based on error returned by your process function or something in the item itself.

**Override Example**:

```javascript
queue.shouldRetry = function (item, attemptNumber, error) {
  // max attempts
  if (attemptNumber > this.maxAttempts) return false;

  // based on something in the item itself
  if (new Date(item.timestamp) - new Date() > 86400000) return false;

  // selective error handling
  if (error.code === '429') return false;

  return true;
};
```

### .start

Starts the queue processing items. Anything added before calling `.start` will be queued until `.start` is called.

```javascript
queue.start();
```

### .stop

Stops the queue from processing. Any retries queued may be picked claimed by another queue after a timeout.

```javascript
queue.stop();
```
