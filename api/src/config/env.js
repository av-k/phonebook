import fs from 'fs';
import path from 'path';

const env = (() => {
  if (!process.env.NODE_ENV) {
    const NODE_ENV = 'development';
    const dotenvDir = path.join(__dirname, `../../.env.${NODE_ENV}`);
    return require('dotenv').parse(fs.readFileSync(dotenvDir));
  }

  const defaultEnvVariables = {
    NODE_ENV: 'development',
    VERSION: 1,
    HOST: '0.0.0.0',
    PORT: 3010,
    DB_URL: 'mongodb://127.0.0.1:27017/phonebook',
    DB_SETTINGS: {
      poolSize: 10,
      useNewUrlParser: true
    }
  };

  const filteredEnvVariables = Object.keys(process.env).reduce((accumulator, envName) => {
    if (Object.keys(defaultEnvVariables).includes(envName)) {
      accumulator[envName] = process.env[envName];
    }
    return accumulator;
  }, {});

  return {
    ...defaultEnvVariables,
    ...filteredEnvVariables
  }
})();

module.exports = env;
