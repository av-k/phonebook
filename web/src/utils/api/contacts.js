import { API_ROUTES } from 'config/constants';
import { getAxios } from './axiosClient';

/**
 * Get list of contacts
 * @param {object} props - list of properties
 * @returns {*} - axios request
 */
export const getListOfContactsXHR = (props = {}) => {
  const axios = getAxios();
  const { pagination = false, limit = 0, page = 0 } = props;
  const url = API_ROUTES.CONTACTS_LIST_GET
    .replace('{pagination}', pagination)
    .replace('{limit}', limit)
    .replace('{page}', page);

  return axios.get(url);
};

/**
 * Create an contact
 * @param {object} data - new contact data
 * @returns {*} - axios request
 */
export const createContactXHR = (data = {}) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_CREATE;
  const { firstName, lastName, phoneNumber } = data;
  const payload = { firstName, lastName, phoneNumber };

  return axios.post(url, payload);
};

/**
 * Upload an file with list of contacts
 * @param {object} data - new contact data
 * @returns {*} - axios request
 */
export const uploadContactsListXHR = ({ files }) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_LIST_UPLOAD;
  const data = new FormData();
  files.forEach((file, index) => data.append(`file_${index}`, file, file.name));

  return axios.post(url, data);
};

/**
 * Update an contact
 * @param {string} id - contact identification
 * @param {object} data - new contact data
 * @returns {*} - axios request
 */
export const updateContactXHR = (id, data = {}) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_UPDATE.replace('{id}', id);
  const { firstName, lastName, phoneNumber } = data;
  const payload = { firstName, lastName, phoneNumber };

  return axios.put(url, payload);
};

/**
 * Delete an contact
 * @param {string} id - contact identification
 * @returns {*} - axios request
 */
export const deleteContactXHR = (id) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_DELETE.replace('{id}', id);

  return axios.delete(url);
};

/**
 * Delete list of contacts
 * @param {array} ids - list of contact identifications
 * @returns {*} - axios request
 */
export const deleteContactListXHR = (ids) => {
  const axios = getAxios();
  const url = API_ROUTES.CONTACT_LIST_DELETE.replace('{ids}', ids);

  return axios.delete(url);
};
