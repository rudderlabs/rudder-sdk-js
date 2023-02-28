/* eslint-disable import/no-extraneous-dependencies */

require('isomorphic-fetch');

// Mocking Math random
global.Math.random = () => 0.5;

// Fail tests on warnings, not only errors
// console.error = message => {
//     throw new Error(message);
// };
