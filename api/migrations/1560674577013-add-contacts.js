const mongodb = require('mongodb');
const config = require('../src/config');

const { MongoClient } = mongodb;

/**
 * Get DB instance
 * @returns {Promise<*>}
 */
async function getDB() {
  const {
    DB_URL, DB_HOST, DB_PORT, DB_NAME
  } = config;
  const url = DB_URL || `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
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
  await db.collection('contacts').insertMany(require('../data/contacts').data); // eslint-disable-line
  return next();
};

module.exports.down = async (next) => {
  const db = await getDB();
  if (!db.collection) { return next(db); } // Error
  await db.collection('contacts').deleteMany({});
  return next();
};
