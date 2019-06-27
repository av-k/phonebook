import fs from 'fs';
import path from 'path';

let localEnvConfig = {};

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv'); // eslint-disable-line
  const dotenvDir = path.join(__dirname, '../../.env');
  localEnvConfig = dotenv.parse(fs.readFileSync(dotenvDir));
}

const defaultEnvVariables = {
  NODE_ENV: 'development',
  VERSION: 1,
  HOST: '0.0.0.0',
  PORT: 3010,
  DB_HOST: '127.0.0.1',
  DB_PORT: 27017,
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  DB_SETTINGS: {
    poolSize: 10,
    useNewUrlParser: true
  }
};
const envVariables = Object.keys(localEnvConfig).reduce((accumulator, envName) => {
  const localName = /^API_/.test(envName) ? envName.replace(/^API_/, '') : envName;

  if (Object.keys(defaultEnvVariables).includes(localName)) {
    accumulator[localName] = localEnvConfig[envName];
  }

  return accumulator;
}, {});
const common = {
  ...defaultEnvVariables,
  ...envVariables
};

module.exports = common;
