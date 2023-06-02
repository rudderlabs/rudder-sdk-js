import { TestBook } from './TestBook';
import { sanityTestBookData } from '../testBookSuites';

const initSanitySuite = () => {
  setTimeout(() => {
    console.log('Mount sanity suite test book');
    return new TestBook(sanityTestBookData, 1500);
  }, 1);
};

export { initSanitySuite };
