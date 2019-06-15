import hapiMongodb from 'hapi-mongodb';
import config from '../config';

/**
 * Database Initialization
 * @param props
 * @returns {Promise<void>}
 */
export async function run(props = {}) {
  const { server } = props;
  const {
    DB_URL, DB_HOST, DB_PORT, DB_NAME, DB_SETTINGS
  } = config;

  await server.register({
    plugin: hapiMongodb,
    options: {
      url: DB_URL || `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      settings: DB_SETTINGS,
      decorate: true
    }
  });
}
