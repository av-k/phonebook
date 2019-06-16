export const { isDEV, API_HOST, API_PORT, API_VERSION } = process.env || {};

export const ROUTES = {
  HOME_PAGE: '/'
};

export const API_ROUTES = {
  CONTACTS_LIST_GET: '/contacts/?pagination={pagination}&limit={limit}&page={page}',
  CONTACT_UPDATE: '/contacts/{id}',
  CONTACT_DELETE: '/contacts/{id}'
};
