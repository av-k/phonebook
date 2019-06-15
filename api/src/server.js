import Hapi from '@hapi/hapi';
import config from './config';
import boot from './boot';

// Configurations
const server = Hapi.server({
  host: config.HOST,
  port: config.PORT,
  routes: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
});

// Server Start up
const start = async () => {
  try {
    await boot({ server });
    await server.start();
  } catch (err) {
    console.warn(err); // eslint-disable-line
    process.exit(1);
  }

  console.log('Server running a %s, in %s mode', server.info.uri, config.NODE_ENV); // eslint-disable-line
};

start();
