/**
 * Created by mugongxu on 2019/7/24.
 * 热搜接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');
const util = require('../util/index.js');
const resMerge = require('../util/resMerge.js');

const initHotSearch = (app) => {
  // 排行榜
  app.get(api.hotSearch.url, (req, res) => {
    // 传参
    const query = req.query;
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    // 连接数据库
    connectDB((db, source) => {
      if (!db) {
        res.send(resMerge.error({
          errorMessage: source || '服务器出错'
        }));
        return;
      }
      // 获取数据
      util.getDataByPage(db, 'hotSearch', {}, page, pageSize, (err, data) => {
        source.close();
        if (err) {
          res.send(resMerge.error({
            errorMessage: err || '服务器出错'
          }));
        } else {
          res.send(resMerge.success({
            data: { ...data }
          }));
        }
      });
    });
  });
};

module.exports = initHotSearch;
