import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import config from '../config';

/**
 * Get validate params for request
 * @returns {*}
 */
export function getValidateParams() {
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
 * Insert list of contact into DB
 * @param {*} db - db instance
 * @param {array} list - list of contacts
 * @returns {Promise<*>} - promise
 */
export async function insertList({ db, list = [] }) {
  const nowISO = new Date().toISOString();
  const ops = [];

  list.forEach((item) => {
    ops.push(
      {
        updateOne: {
          filter: { phoneNumber: { $eq: item.phoneNumber } },
          update: {
            $set: { ...item, createdAt: nowISO, updatedAt: nowISO }
          },
          upsert: true
        }
      }
    );
  });
  return new Promise(async (resolve) => {
    const results = await new Promise((res, ref) => {
      db.collection('contacts').bulkWrite(ops, { ordered: false }, (err, r) => {
        if (err) { ref(err); }
        res(r);
      });
    });
    const {
      nInserted, nMatched, nModified, nRemoved, upserted
    } = results;
    const data = {
      nInserted, nMatched, nModified, nRemoved, upserted
    };
    resolve(data);
  });
}

/**
 * Handler for method POST - create list of contacts
 * @returns {object} - router config
 */
export default function contactsListCreate() {
  async function handler(request) {
    const { db } = request.mongo;
    const { list } = request.payload;

    try {
      const data = await insertList({ db, list });
      return { success: true, data };
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
