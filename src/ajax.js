/**
 * 通用AJAX客户端
 */
const request = require('request');

const ajax = {
  get: (url, data, callback) => {
    request({
      url: url,
      method: 'GET',
      qs: data,
      json: true,
      host: 'm.kugou.com',
      headers: {
        'Host': 'm.kugou.com',
        'Referer': 'http://m.kugou.com/'
      }
    }, (error, response) => {
      callback(response, error);
    });
  },
  post: (url, data, callback) => {
    request({
      url: url,
      method: 'POST',
      form: data,
      json: true,
      headers: {
        'content-type': 'application/json',
      }
    }, (error, response) => {
      callback(response, error);
    });
  }
};

module.exports = ajax;
