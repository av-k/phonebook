import path from 'path';
import glob from 'glob';
import pagination from 'hapi-pagination';
import config from '../config';

const ROUTER_PREFIX = `/v${config.VERSION}`;

/**
 *
 * @param props
 */
function bindResponsesPagination(props = {}) {
  const { server } = props;
  const options = {
    query: {
      page: {
        name: 'page',
        default: 0
      },
      limit: {
        name: 'limit',
        default: 10
      },
      pagination: {
        name: 'pagination',
        default: true,
        active: true
      },
      invalid: 'defaults'
    },
    meta: {
      page: {
        active: true
      }
    },
    routes: {
      include: [
        /contacts\/list/
      ]
    }
  };
  server.register({ plugin: pagination, options });
}

/**
 * Router Initialization
 * @param props
 */
export async function run(props = {}) {
  const { dir, server } = props;
  const normalizedPath = path.join(__dirname, dir);

  server.realm.modifiers.route.prefix = ROUTER_PREFIX;
  bindResponsesPagination({ server });

  glob.sync(`${normalizedPath}/*.js`).forEach((filePath) => {
    server.route(require(path.resolve(filePath)).default({ server })); // eslint-disable-line
  });
}
