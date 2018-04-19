import axios from 'axios'
import qs from 'qs'
// var querystring = require('querystring');
const isDev = /\.dev/.test(location.hostname);
axios.defaults.baseURL = '/';
axios.defaults.timeout = 5000;
axios.defaults.transformRequest = (data, headers) => {
    return qs.stringify(data);
  }
  //设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // Do something before request is sent

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, config.retryDelay || 1);
  });

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function() {
    return axios(config);
  });
});



export default axios;