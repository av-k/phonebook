const env = require('./env');
const paths = require('./paths');

console.table(env); // eslint-disable-line

module.exports = {
  isPROD: env.NODE_ENV === 'production',
  isDEV: env.NODE_ENV === 'development',
  paths,
  ...env
};
