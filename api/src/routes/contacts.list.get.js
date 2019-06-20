import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { getProp } from '../utils/helpers';
import config from '../config';

/**
 * Handler for method GET - list of contacts
 * @returns {object} - router config
 */
export default function contactsListGet() {
  const { PAGINATION } = config;

  async function handler(request) {
    const { db } = request.mongo;
    const { pagination, limit = 10, page = 0 } = request.query;
    const sort = { updatedAt: -1 };

    try {
      const results = await new Promise(async (resolve, reject) => {
        const count = await db.collection('contacts').find({}).count();
        const requestSkip = pagination ? page * limit : 0;
        const requestLimit = pagination ? limit : count;
        db.collection('contacts')
          .find({})
          .sort(sort)
          .skip(requestSkip)
          .limit(requestLimit)
          .toArray((err, rows = []) => {
            if (err) { return reject(new Error(`Internal MongoDB error ${err}`)); }
            return resolve({ count, rows });
          });
      });
      return {
        results: getProp(results, 'rows', []),
        totalCount: getProp(results, 'count', 0)
      };
    } catch (err) {
      throw Boom.internal('Internal MongoDB error', err);
    }
  }

  return {
    method: 'GET',
    path: '/contacts/',
    config: {
      handler,
      description: 'Get list of contacts',
      notes: 'List of exists contacts',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        query: {
          pagination: Joi.boolean().default(PAGINATION.USE),
          limit: Joi.number().default(PAGINATION.LIMIT).integer(),
          page: Joi.number().default(PAGINATION.PAGE).integer()
        }
      }
    }
  };
}
