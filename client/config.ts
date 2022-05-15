const baseUrl = 'http://localhost';
const apiPort = 3000;
const apiPath = '/api/v1/';
const socketPort = 8080;

export default {
  baseUrl: 'http://localhost',
  apiBaseUrl: `${baseUrl}:${apiPort}${apiPath}`,
  socketBaseUrl: `${baseUrl}:${socketPort}`,
};

