if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // eslint-disable-line
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
const envVariables = Object.keys(process.env).reduce((accumulator, envName) => {
  const localName = envName.replace(/^API_/, '');
  if (Object.keys(defaultEnvVariables).includes(localName)) {
    accumulator[localName] = process.env[envName];
  }

  return accumulator;
}, {});
const common = {
  ...defaultEnvVariables,
  ...envVariables
};

module.exports = common;
