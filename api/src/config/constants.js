const VALIDATION = {
  PHONE_NUMBER: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/im // eslint-disable-line
};

const PAGINATION = {
  LIMIT: 10,
  PAGE: 0,
  USE: false
};

module.exports = {
  VALIDATION,
  PAGINATION
};
