const env = require('./env');
const constants = require('./constants');


const common = {
  ...constants,
  isDEV: env.NODE_ENV !== 'production',
  ...env
};

console.table(env); // eslint-disable-line

module.exports = common;
