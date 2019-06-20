import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import config from '../config';

/**
 * Get validate params for request
 * @returns {*}
 */
function getValidateParams() {
  const { VALIDATION } = config;
  const contact = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().regex(VALIDATION.PHONE_NUMBER).required()
  });
  return {
    list: Joi.array().items(contact)
  };
}

/**
 * Handler for method POST - create list of contacts
 * @returns {object} - router config
 */
export default function contactsListCreate() {
  async function handler(request) {
    const { db } = request.mongo;
    const { list } = request.payload;
    const ops = [];

    list.forEach((item) => {
      ops.push(
        {
          updateOne: {
            filter: { phoneNumber: { $eq: item.phoneNumber } },
            update: {
              $set: { ...item, createdAt: new Date(), updatedAt: new Date() }
            },
            upsert: true
          }
        }
      );
    });

    try {
      const results = await new Promise((resolve, reject) => {
        db.collection('contacts').bulkWrite(ops, { ordered: false }, (err, r) => {
          if (err) reject(err);
          resolve(r);
        });
      });
      const success = true;
      const {
        nInserted, nMatched, nModified, nRemoved, upserted
      } = results;
      const data = {
        nInserted, nMatched, nModified, nRemoved, upserted
      };

      return { success, data };
    } catch (err) {
      throw Boom.internal('Internal MongoDB error', err);
    }
  }

  return {
    method: 'POST',
    path: '/contacts/list/',
    config: {
      handler,
      description: 'Create list of contacts',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        payload: getValidateParams()
      }
    }
  };
}
