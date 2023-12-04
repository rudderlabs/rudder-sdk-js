import { TestBook } from './TestBook';
import { devSanityTestBookData, sanityTestBookData } from '../testBookSuites';

const initSanitySuite = () => {
  setTimeout(() => {
    console.log('Mount sanity suite test book');
    // eslint-disable-next-line no-undef
    const testBookData = IS_DEV_TESTBOOK === true ? devSanityTestBookData : sanityTestBookData;
    return new TestBook(testBookData, 1500);
  }, 1);
};

export { initSanitySuite };
