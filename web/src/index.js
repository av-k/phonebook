import 'core-js/shim';
import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'pages';
import * as axiosClient from 'utils/api/axiosClient';
import { getRandomString } from 'utils/helpers';
import { isDEV, API_HOST, API_PORT, API_VERSION } from './config/constants';

if (isDEV && module.hot) {
  module.hot.accept();
}

export const MOUNT_NODE = (() => {
  const element = document.createElement('div');
  element.id = `root_${getRandomString(12)}`;
  element.classList = ['root'];
  document.body.appendChild(element);
  return element;
})();

axiosClient.init({ API_HOST, API_PORT, API_VERSION });
ReactDOM.render(<Root />, MOUNT_NODE);
