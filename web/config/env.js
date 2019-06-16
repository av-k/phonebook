const defaultEnvVariables = {
  NODE_ENV: 'development',
  HOST: '0.0.0.0',
  PORT: 3000,
  APP_PREFIX: 'AP',
  API_DOMAIN: '',
  API_PORT: '',
  API_VERSION: 1
};
const envVariables = Object.keys(process.env).reduce((accumulator, envName) => {
  if (Object.keys(defaultEnvVariables).includes(envName)) {
    accumulator[envName] = process.env[envName];
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
