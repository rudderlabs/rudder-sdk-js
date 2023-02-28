import { TestBook } from './TestBook';
import { sanityTestBookData } from '../testBookSuites';

const initSanitySuite = () => {
  setTimeout(() => {
    new TestBook(sanityTestBookData, 1500);
  }, 5000);
};

export { initSanitySuite };
