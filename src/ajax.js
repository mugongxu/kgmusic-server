/**
 * 通用AJAX客户端
 */
// const request = require('request');
const axios = require('axios');
const http = require('http');

const ajax = {
  get: (url, data, callback) => {
    // request({
    //   url: url,
    //   method: 'GET',
    //   qs: data,
    //   json: true,
    //   host: 'm.kugou.com',
    //   headers: {
    //     'host': 'm.kugou.com',
    //     'referer': 'http://m.kugou.com/'
    //   }
    // }, (error, response) => {
    //   callback(response, error);
    // });
    axios.get(url, {
      headers: {
        'content-type': 'application/json',
        referer: 'http://m.kugou.com/'
      },
      params: data
    }).then(response => {
      callback(response);
    }).catch(e => {
      callback(null, e);
    });
  },
  post: (url, data, callback) => {
    // request({
    //   url: url,
    //   method: 'POST',
    //   form: data,
    //   json: true,
    //   headers: {
    //     'content-type': 'application/json',
    //   }
    // }, (error, response) => {
    //   callback(response, error);
    // });
    axios.post(url, {
      headers: {
        'content-type': 'application/json',
        referer: 'http://m.kugou.com/'
      },
      data: data
    }).then(response => {
      callback(response);
    }).catch(e => {
      callback(null, e);
    });
  },
  // get: (url, data, callback) => {
  //   let params = JSON.stringify(data);

  //   let opt = {
  //     host: 'm.kugou.com',
  //     method: 'GET',
  //     path: url,
  //     headers:{
  //       'Content-Type': 'application/json',  
  //       'Content-Length': params.length
  //     }
  //   };
  //   let bodv = '';
  //   let req = http.request(opt, (res) => {
  //     res.on('data', (data) => {
  //       bodv += data;
  //     }).on('end', () => {
  //       callback(JSON.parse(bodv));
  //     });
  //   }).on('error', () => {
  //     callback(bodv);
  //   });

  //   req.write(params);
  //   req.end();
  // }
};

module.exports = ajax;
