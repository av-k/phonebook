/**
 * Implementation of lodash.get function
 * https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab
 * @param object
 * @param keys
 * @param defaultVal
 * @returns {*}
 */
export function getProp(object = {}, keys, defaultVal) {
  keys = Array.isArray(keys) ? keys : keys.split('.');
  object = object[keys[0]];
  if (object && keys.length > 1) {
    return getProp(object, keys.slice(1));
  }
  return object === undefined ? defaultVal : object;
}
