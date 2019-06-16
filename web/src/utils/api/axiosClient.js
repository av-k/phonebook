import axios from 'axios';
import { getProp } from 'utils/helpers';

let axiosClient = null;

class AxiosClient {
  _ACCESS_TOKEN;
  _API_DOMAIN;
  _API_VERSION = 1;

  /**
   * Constructor
   * @param {object} props - list of properties (_ACCESS_TOKEN, _API_DOMAIN, _API_VERSION and etc)
   */
  constructor(props = {}) {
    Object.keys(props).forEach((propName) => this.setProperty(propName, props[propName]));

    const localAxios = axios.create({
      baseURL: `${this._API_DOMAIN}/api/${this._API_VERSION}`,
      timeout: 25000
    });

    localAxios.interceptors.request.use((config) => {
      const accessToken = config.headers.Authorization || `Bearer ${this._ACCESS_TOKEN}`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
      if (accessToken) {
        headers.Authorization = accessToken;
      }
      return {
        ...config,
        headers
      };
    });

    localAxios.interceptors.response.use(
      (response) => Promise.resolve(getProp(response, 'data', null)),
      (error) => {
        console.warn(error); // eslint-disable-line
        return Promise.resolve(null);
      }
    );

    this._client = localAxios;
  }

  /**
   * Set private property
   * @param {string} propName - property key
   * @param {any} propValue - property value
   * @returns {void}
   */
  setProperty(propName, propValue) {
    this[`_${propName}`.toUpperCase()] = propValue;
  }

  /**
   * Get instance
   * @returns {AxiosInstance} - AxiosInstance
   */
  getAxios() {
    return this._client;
  }
}

/*
 * Initialization
 * @param {object} props - some properties
 */
function init(props) {
  axiosClient = new AxiosClient(props);
}

/*
 * Return instance of Axios
 * @returns {object}
 */
function getAxios() {
  return axiosClient.getAxios();
}

export { init, getAxios };
