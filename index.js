// 接口转发
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const initBanner = require('./src/core/initBanner.js');
const initRank = require('./src/core/initRank.js');
const initSheet = require('./src/core/initSheet.js');
const initSinger = require('./src/core/initSinger.js');
const initHotSearch = require('./src/core/initHotSearch.js');
const initSearch = require('./src/core/initSearch.js');
const initSongDetail = require('./src/core/initSongDetail.js');

// body-parser解析
app.use(bodyParser.json()); // json请求
app.use(bodyParser.urlencoded({ // 表单请求
  extended: true
}));
// 监听
app.listen(13770, '0.0.0.0', () => {
  console.log('服务器开启');
});

initBanner(app);
initRank(app);
initSheet(app);
initSinger(app);
initHotSearch(app);
initSearch(app);
initSongDetail(app);
