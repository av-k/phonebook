import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import Mongodb from 'mongodb';
import { getProp } from '../utils/helpers';

/**
 * Handler for method DELETE - delete an exists contact
 * @returns {object} - router config
 */
export default function contactDelete() {
  const { ObjectID } = Mongodb;

  async function handler(request) {
    const { db } = request.mongo;
    const { id } = request.params;
    const query = {
      _id: { $eq: ObjectID(id) }
    };

    try {
      const deletedContact = await db.collection('contacts').deleteOne(query);
      const success = !!getProp(deletedContact, 'result.ok', false);

      return { success, data: null };
    } catch (err) {
      throw Boom.internal('Internal MongoDB error', err);
    }
  }

  return {
    method: 'DELETE',
    path: '/contacts/{id}',
    config: {
      handler,
      description: 'Delete an exists contact',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        params: {
          id: Joi.string().required()
        }
      }
    }
  };
}
