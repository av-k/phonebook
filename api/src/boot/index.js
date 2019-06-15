import * as db from './db';
import * as router from './router';
import * as swagger from './swagger';

export default async (props = {}) => {
  const { server } = props;

  server.app.helpers = {};

  await db.run({ server });
  await router.run({ dir: '../routes', server });
  await swagger.run({ server });
};
