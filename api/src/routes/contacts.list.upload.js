import Boom from '@hapi/boom';
import csv from 'csvtojson';
import { VALIDATION } from '../config/constants';
import { insertList } from './contacts.list.post';

/**
 * Get common data - originals, newbies, conflicts
 * @param {*} db - db instance
 * @param {*} listOfFiles - stream data
 * @returns {Promise<any>}
 */
export function getUploadMetaData({ db, listOfFiles }) {
  // In an ideal world here should be implemented logic with additional collection `conflicts`
  return new Promise(async (resolve, reject) => {
    const jsonArrays = await Promise.all(listOfFiles.map(file => csv().fromStream(file)));
    const jsonArray = jsonArrays.reduce((accumulator, arr) => {
      accumulator = accumulator.concat(arr);
      return accumulator;
    }, []);
    const phonesList = [];
    const uploaded = jsonArray.reduce((accumulator, item) => {
      if (!item.first_name || !item.last_name || !item.phone) { return accumulator; }
      if (!VALIDATION.PHONE_NUMBER.test(item.phone)) { return accumulator; }
      phonesList.push(item.phone);
      accumulator.push({
        firstName: item.first_name,
        lastName: item.last_name,
        phoneNumber: item.phone
      });
      return accumulator;
    }, []);

    db.collection('contacts').find({ phoneNumber: { $in: phonesList } })
      .toArray((err, originals = []) => {
        if (err) { return reject(new Error(`Internal MongoDB error ${err}`)); }
        const matchedPhones = originals.map(item => item.phoneNumber);
        const conflicts = uploaded.filter(item => matchedPhones.includes(item.phoneNumber));
        const newbies = uploaded.filter(item => !matchedPhones.includes(item.phoneNumber));
        return resolve({ originals, newbies, conflicts });
      });
  });
}

/**
 * Handler for method POST - upload list of contacts from file
 * @returns {object} - router config
 */
export default function contactsListUpload() {
  async function handler(request) {
    const { db } = request.mongo;
    const { payload = {} } = request;
    const listOfFiles = Object.keys(payload).reduce((accumulator, key) => {
      if (/^file/i.test(key)) { accumulator.push(payload[key]); }
      return accumulator;
    }, []);

    if (listOfFiles.length === 0) {
      throw Boom.internal('Upload files not exists in request body');
    }

    try {
      const metaData = await getUploadMetaData({ db, listOfFiles });
      if (metaData.conflicts.length > 0) {
        return { success: true, data: metaData };
      }
      const data = await insertList({ db, list: metaData.newbies });
      return { success: true, data };
    } catch (err) {
      throw Boom.internal('File upload error', err);
    }
  }

  return {
    method: 'POST',
    path: '/contacts/list/upload/',
    config: {
      payload: {
        parse: true,
        output: 'stream',
        allow: 'multipart/form-data'
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      handler,
      description: 'Upload the contacts from file',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      }
    }
  };
}
