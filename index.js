// 接口转发
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ajax = require('./src/ajax.js');
const api = require('./src/api.js');
const initBanner = require('./src/core/initBanner.js');
// body-parser解析
app.use(bodyParser.json()); // json请求
app.use(bodyParser.urlencoded({ // 表单请求
  extended: true
}));
// 监听
app.listen(13770, '0.0.0.0', () => {
  console.log('服务器开启');
});

// api.forEach(item => {
//   // 请求方式
//   if (item.method === 'GET') {
//     app.get(item.url, (req, res) => {
//       // 处理link拼接
//       let link = item.link;
//       if (item.linkKey) {
//         const reg = new RegExp('{' + item.linkKey + '}');
//         link = link.replace(reg, req.query[item.linkKey]);
//       }
//       ajax.get(link, req.query, (response, error) => {
//         // 处理数据，转化成自己项目统一结构
//         if (!error && response.status == 200) {
//           res.send({
//             errorCode: null,
//             errorMessage: null,
//             status: 0,
//             success: true,
//             ...response.data
//           });
//         } else {
//           res.send({
//             errorCode: 99,
//             errorMessage: '服务器出错',
//             status: -1,
//             success: false,
//             ...error
//           });
//         }
//       });
//     });
//   } else if (item.method === 'POST') {
//     app.post(item.url, (req, res) => {
//       // 处理link拼接
//       let link = item.link;
//       if (item.linkKey) {
//         link = link + req.body[item.linkKey];
//       }
//       ajax.post(link, req.body, (response, error) => {
//         // 处理数据，转化成自己项目统一结构
//         if (!error && response.status == 200) {
//           res.send({
//             errorCode: null,
//             errorMessage: null,
//             status: 0,
//             success: true,
//             ...response.data
//           });
//         } else {
//           res.send({
//             errorCode: 99,
//             errorMessage: '服务器出错',
//             status: -1,
//             success: false,
//             ...error
//           });
//         }
//       });
//     });
//   }
// });

initBanner(app);
