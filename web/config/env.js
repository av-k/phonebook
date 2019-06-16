if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // eslint-disable-line
}

const defaultEnvVariables = {
  NODE_ENV: 'development',
  HOST: '0.0.0.0',
  PORT: 3000,
  APP_PREFIX: '',
  API_HOST: '',
  API_PORT: '',
  API_VERSION: ''
};
const envVariables = Object.keys(process.env).reduce((accumulator, envName) => {
  const localName = envName.replace(/^WEB_/, '');
  if (Object.keys(defaultEnvVariables).includes(localName)) {
    accumulator[localName] = process.env[envName];
  }

  return accumulator;
}, {});

/**
 * Get environment variables
 * @type {{NODE_ENV: string, HOST: string, PORT: number, APP_PREFIX: string}}
 */
module.exports = {
  ...defaultEnvVariables,
  ...envVariables
};
