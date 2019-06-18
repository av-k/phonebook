import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import Mongodb from 'mongodb';
import { getProp } from '../utils/helpers';

/**
 * Handler for method DELETE - delete list of exists contacts
 * @returns {object} - router config
 */
export default function contactsDelete() {
  const { ObjectID } = Mongodb;
  async function handler(request) {
    const { db } = request.mongo;
    const idsString = request.params.ids;
    const ids = idsString
      .replace(/(^\[|\]$)/g, '')
      .split(',')
      .map(idString => ObjectID(idString.trim()));
    const query = {
      _id: { $in: ids }
    };

    try {
      const deletedContacts = await db.collection('contacts').deleteMany(query);
      const success = !!getProp(deletedContacts, 'deletedCount', 0);

      return { success, data: null };
    } catch (err) {
      throw Boom.internal('Internal MongoDB error', err);
    }
  }

  return {
    method: 'DELETE',
    path: '/contacts/list/{ids}',
    config: {
      handler,
      description: 'Delete list of exists contacts',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        params: {
          ids: Joi.string().required()
        }
      }
    }
  };
}
