import { TestBook } from './TestBook';
import { sanityTestBookData } from '../testBookSuites/index';

const initSanitySuite = () => {
  setTimeout(() => {
    console.log('Mount sanity suite test book');
    new TestBook(sanityTestBookData, 1500);
  }, 1);
};

export { initSanitySuite };
