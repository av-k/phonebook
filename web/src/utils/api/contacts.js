import { API_ROUTES } from 'config/constants';
import { getAxios } from './axiosClient';

/**
 * Get list of contacts
 * @param {object} props - list of properties
 * @returns {*} - axios request
 */
export const getListOfContacts = (props = {}) => {
  const axios = getAxios();
  const { pagination = false, limit = 0, page = 0 } = props;
  const url = API_ROUTES.CONTACTS_LIST_GET
    .replace('{pagination}', pagination)
    .replace('{limit}', limit)
    .replace('{page}', page);

  return axios.get(url);
};

/**
 * Update an contact
 * @param {string} id - contact identification
 * @param {object} data - new contact data
 * @returns {*} - axios request
 */
export const updateContact = (id, data = {}) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_UPDATE.replace('{id}', id);
  const { firstName, lastName, phoneNumber } = data;
  const payload = {
    firstName, lastName, phoneNumber
  };

  return axios.put(url, payload);
};

/**
 * Delete an contact
 * @param {string} id - contact identification
 * @returns {*} - axios request
 */
export const deleteContact = (id) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_DELETE.replace('{id}', id);

  return axios.delete(url);
};
