import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import Blipp from 'blipp';
import HapiSwagger from 'hapi-swagger';
import Pack from '../../package';

/**
 * Router Initialization
 * @param {object} props - list of properties
 */
export async function run(props = {}) {
  const { server } = props;
  const swaggerOptions = {
    basePath: '/v1',
    pathPrefixSize: 2,
    documentationPath: '/documentation',
    info: {
      title: 'API Documentation',
      version: Pack.version
    }
  };

  await server.register([
    Inert,
    Vision,
    Blipp,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);
}
