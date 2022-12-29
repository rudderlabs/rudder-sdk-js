/* eslint-disable import/no-extraneous-dependencies */

require('isomorphic-fetch');

// Mocking Math random
global.Math.random = () => 0.5;
