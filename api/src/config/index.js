import env from './env';
import * as constants from './constants';


const common = {
  ...constants,
  isDEV: env.NODE_ENV !== 'production',
  ...env
};

console.table(env); // eslint-disable-line

export default common;
