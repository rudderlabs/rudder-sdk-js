import PreProcessQueue from '../../src/utils/PreProcessQueue';
import RudderElement from '../../src/utils/RudderElement';

describe('PreProcessQueue', () => {
    let preProcessQueue;

    beforeEach(() => {
        preProcessQueue = new PreProcessQueue();
    });

    afterEach(() => {
        preProcessQueue = null;
    });

    describe('init()', () => {
        it('should initialize the payloadQueue with default options', () => {
            preProcessQueue.init();

            expect(preProcessQueue.payloadQueue).toBeDefined();
        });

        it('should initialize the payloadQueue with custom options', () => {
            const options = {
                maxRetryDelay: 360000,
                minRetryDelay: 1000,
                backoffFactor: 2,
                maxAttempts: Infinity,
                maxItems: 100,
            };
            preProcessQueue.init(options);

            expect(preProcessQueue.payloadQueue.backoff.FACTOR).toEqual(options.backoffFactor);
            expect(preProcessQueue.payloadQueue.backoff.MAX_RETRY_DELAY).toEqual(options.maxRetryDelay);
            expect(preProcessQueue.payloadQueue.backoff.MIN_RETRY_DELAY).toEqual(options.minRetryDelay);
            expect(preProcessQueue.payloadQueue.maxAttempts).toEqual(options.maxAttempts);
        });

        it('should set the callback', () => {
            const callback = jest.fn();
            preProcessQueue.init(null, callback);

            expect(preProcessQueue.callback).toEqual(callback);
        });
    });

    describe('activateProcessor()', () => {
        it('should set processQueueElements to true', () => {
            preProcessQueue.activateProcessor();
            expect(preProcessQueue.processQueueElements).toBe(true);
        });
    });

    describe('processQueueElement()', () => {
        it('should call the queueFn with null if processQueueElements is true', () => {
            const type = 'track';
            const rudderElement = new RudderElement();
            const queueFn = jest.fn();
            const callback = jest.fn();
            preProcessQueue.init({}, callback);

            preProcessQueue.processQueueElements = true;
            preProcessQueue.processQueueElement(type, rudderElement, queueFn);
            expect(queueFn).toHaveBeenCalledWith(null);
        });

        it('should call the queueFn with an error if processQueueElements is false', () => {
            const type = 'track';
            const rudderElement = new RudderElement();
            const queueFn = jest.fn();

            preProcessQueue.processQueueElements = false;
            preProcessQueue.processQueueElement(type, rudderElement, queueFn);
            expect(queueFn).toHaveBeenCalledWith(
                new Error('The queue elements are not ready to be processed yet'),
            );
        });
    });
});
