import path from 'path';
import migrate from 'migrate';

/**
 * Database migration
 * @returns {Promise<void>}
 */
export async function run() {
  return new Promise((resolve, reject) => {
    migrate.load({
      stateStore: path.join(__dirname, '../../.migrate'),
      migrationsDirectory: path.join(__dirname, '../../migrations')
    }, (error, set) => {
      if (error) {
        console.warn(`migrations unsuccessfully ran ${error}`); // eslint-disable-line
        reject(new Error(error));
      }
      set.up((err) => {
        if (err) {
          console.warn(`migrations unsuccessfully ran ${err}`); // eslint-disable-line
          reject(new Error(error));
        }
        console.info('migrations successfully ran'); // eslint-disable-line
        resolve();
      });
    });
  });
}
