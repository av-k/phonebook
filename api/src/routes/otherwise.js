import Boom from '@hapi/boom';

/**
 * Otherwise handler
 */
export default function otherwise() {
  return {
    method: '*',
    path: '/{any*}',
    handler: () => {
      throw Boom.notFound();
    }
  };
}
