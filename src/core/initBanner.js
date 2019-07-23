/**
 * Created by mugongxu on 2019/7/18.
 * 首页接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');
const util = require('../util/index.js');
const resMerge = require('../util/resMerge.js');

const initBanner = (app) => {
  app.get(api.banner.url, (req, res) => {
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
      // banner
      const getBannerList = new Promise((resolve, reject) => {
        db.collection('banner').find().toArray((err, result) => {
          if (err) reject(err)
          result = (result || []).map(item => {
            return {
              extra: item.extra,
              id: item.id,
              imgurl: item.imgurl,
              online: item.online,
              title: item.title,
              type: item.type
            };
          });
          resolve(result);
        });
      });
      // 新歌
      const getUptodateList = new Promise((resolve, reject) => {
        // 获取数据
        util.getDataByPage(db, 'uptodate', {}, page, pageSize, (err, data) => {
          if (err)  reject(err);
          // 获取歌曲
          let total = data.total;
          let list = data.list;
          util.getSongInfo(db, 'songs', list, (err, songs) => {
            if (err)  reject(err);
            resolve({
              songs,
              total
            });
          });
        });
      });
      // 获取数据
      Promise.all([getBannerList, getUptodateList]).then(response => {
        source.close();
        let bannerList = response[0] || [];
        let songsObj = response[1] || {};
        res.send(resMerge.success({
          data: {
            banner: [...bannerList],
            list: [...(songsObj.songs || [])],
            page,
            pageSize,
            total: songsObj.total || 0
          }
        }));
      }).catch(err => {
        source.close();
        res.send(resMerge.error({
          errorMessage: err || '服务器出错'
        }));
      });
    });
  });
};

module.exports = initBanner;
