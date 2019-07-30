/**
 * Created by mugongxu on 2019/7/24.
 * 搜索接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');
const util = require('../util/index.js');
const resMerge = require('../util/resMerge.js');

const initSearch = (app) => {
  // 排行榜
  app.get(api.search.url, (req, res) => {
    // 传参
    const query = req.query;
    const keyword = query.keyword || '';
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    const reg = new RegExp(keyword, 'gi');
    // 连接数据库
    connectDB((db, source) => {
      if (!db) {
        res.send(resMerge.error({
          errorMessage: source || '服务器出错'
        }));
        return;
      }
      // 获取数据
      util.getDataByPage(db, 'songs', {
        $or: [{
          filename: reg
        }, {
          singerName: reg
        }]
      }, page, pageSize, (err, data) => {
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

module.exports = initSearch;
