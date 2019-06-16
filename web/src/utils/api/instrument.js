import { API_ROUTES } from 'config/constants';
import { getAxios } from './axiosClient';

/**
 *
 * @param {string} str - symbol string
 * @returns {*} - axios request
 */
export const searchInstrument = (str) => {
  const axios = getAxios();
  const url = API_ROUTES.SYMBOL_SEARCH.replace('{symbol}', str);
  return axios.get(url);
};

/**
 *
 * @param {string} symbol - symbol name
 * @returns {*} - axios request
 */
export const loadInstrumentData = (symbol) => {
  const axios = getAxios();
  const url = API_ROUTES.SYMBOL_DATA.replace('{symbol}', symbol);
  return axios.get(url);
};
