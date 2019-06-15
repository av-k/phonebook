import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { getProp } from '../utils/helpers';
import config from '../config';

/**
 * Handler for method POST - create a new contact
 * @returns {object} - router config
 */
export default function contactsCreate() {
  const { VALIDATION } = config;

  async function handler(request) {
    const { db } = request.mongo;
    const newContact = {
      $set: {
        ...request.payload,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    const findOneAndUpdateFilter = {
      phoneNumber: { $eq: getProp(request, 'payload.phoneNumber') }
    };
    const findOneAndUpdateOptions = {
      upsert: true,
      returnOriginal: false
    };

    try {
      const foundAndUpdated = await db.collection('contacts')
        .findOneAndUpdate(findOneAndUpdateFilter, newContact, findOneAndUpdateOptions);
      const success = true;
      const data = getProp(foundAndUpdated, 'value', {});

      return { success, data };
    } catch (err) {
      throw Boom.internal('Internal MongoDB error', err);
    }
  }

  return {
    method: 'POST',
    path: '/contacts/',
    config: {
      handler,
      description: 'Create a new contact',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        payload: Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          phoneNumber: Joi.string().regex(VALIDATION.PHONE_NUMBER).required()
        })
      }
    }
  };
}
