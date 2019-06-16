import 'core-js/shim';
import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'pages';
import * as axiosClient from 'utils/api/axiosClient';
import { isDEV, API_DOMAIN, API_VERSION } from 'config/constants';
import { getRandomString } from 'utils/helpers';

if (isDEV && module.hot) {
  module.hot.accept();
}

export const MOUNT_NODE = (() => {
  const element = document.createElement('div');
  element.id = `root_${getRandomString(12)}`;
  document.body.appendChild(element);
  return element;
})();

axiosClient.init({ API_DOMAIN, API_VERSION });
ReactDOM.render(<Root />, MOUNT_NODE);
