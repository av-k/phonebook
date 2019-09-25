const mongodb = require('mongodb');
const config = require('../src/config');

const { MongoClient } = mongodb;

/**
 * Get DB instance
 * @returns {Promise<*>}
 */
async function getDB() {
  const {
    DB_URL
  } = config;
  const url = DB_URL;
  let mClient = null;

  try {
    mClient = await MongoClient.connect(url, { useNewUrlParser: true });
  } catch (error) {
    return new Error(error);
  }

  return mClient.db();
}

module.exports.up = async (next) => {
  const db = await getDB();
  if (!db.collection) { return next(db); } // Error
  const countRecords = await db.collection('contacts').find({}).count();
  if (countRecords > 0) { return next(); }
  const data = require('../data/contacts').data; // eslint-disable-line
  data.forEach((item) => {
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
  });
  await db.collection('contacts').insertMany(data);
  return next();
};

module.exports.down = async (next) => {
  const db = await getDB();
  if (!db.collection) { return next(db); } // Error
  await db.collection('contacts').deleteMany({});
  return next();
};
