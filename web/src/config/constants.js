export const { isDEV, API_HOST, API_PORT, API_VERSION } = process.env || {};

export const ROUTES = {
  HOME_PAGE: '/'
};

export const VALIDATION = {
  PHONE_NUMBER: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/im // eslint-disable-line
};

export const API_ROUTES = {
  CONTACTS_LIST_GET: '/contacts/?pagination={pagination}&limit={limit}&page={page}',
  CONTACT_CREATE: '/contacts/',
  CONTACT_UPDATE: '/contacts/{id}',
  CONTACT_DELETE: '/contacts/{id}',
  CONTACT_LIST_DELETE: '/contacts/list/{ids}'
};
