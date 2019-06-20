import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import Mongodb from 'mongodb';
import { getProp } from '../utils/helpers';

/**
 * Handler for method PUT - update an exists contact
 * @returns {object} - router config
 */
export default function contactUpdate() {
  const { ObjectID } = Mongodb;

  async function handler(request) {
    const { db } = request.mongo;
    const { id } = request.params;
    const contact = {
      $set: {
        ...request.payload,
        updatedAt: new Date().toISOString()
      }
    };
    const findOneAndUpdateFilter = {
      _id: { $eq: ObjectID(id) }
    };
    const findOneAndUpdateOptions = {
      upsert: false,
      returnOriginal: false
    };

    try {
      if (Object.keys(request.payload).length === 0) {
        return { success: false, data: null };
      }

      const foundAndUpdated = await db.collection('contacts')
        .findOneAndUpdate(findOneAndUpdateFilter, contact, findOneAndUpdateOptions);
      const success = true;
      const data = getProp(foundAndUpdated, 'value', {});

      return { success, data };
    } catch (err) {
      throw Boom.internal('Internal MongoDB error', err);
    }
  }

  return {
    method: 'PUT',
    path: '/contacts/{id}',
    config: {
      handler,
      description: 'Update an exists contact',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        params: {
          id: Joi.string().required()
        },
        payload: Joi.object({
          firstName: Joi.string().optional(),
          lastName: Joi.string().optional(),
          phoneNumber: Joi.string().optional()
        })
      }
    }
  };
}
