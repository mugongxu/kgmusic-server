/**
 * Created by mugongxu on 2019/7/18.
 * 首页接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');
const util = require('../util/index.js');
const resMerge = require('../util/resMerge.js');

const initRank = (app) => {
  // 排行榜
  app.get(api.rankIndex.url, (req, res) => {
    // 传参
    const query = req.query;
    const rankId = Number(query.rankId || 0);
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
      util.getDataByPage(db, 'rank', {}, page, pageSize, (err, data) => {
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

  // 排行榜详情
  app.get(api.rankInfo.url, (req, res) => {
    // 传参
    const query = req.query;
    const rankId = Number(query.rankId || 0);
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    if (!rankId) {
      res.send(resMerge.error({
        errorMessage: 'rankId不允许为空'
      }));
      return;
    }
    // 连接数据库
    connectDB((db, source) => {
      if (!db) {
        res.send(resMerge.error({
          errorMessage: source || '服务器出错'
        }));
        return;
      };
      const getInfo = new Promise((resolve, reject) => {
        util.getSingleInfo(db, 'rank', {
          rankid: rankId
        }, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      const getList = new Promise((resolve, reject) => {
        // 获取数据
        util.getDataByPage(db, 'rankIndex', {
          rankid: rankId
        }, page, pageSize, (err, data) => {
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
      // 数据处理
      Promise.all([getInfo, getList]).then(response => {
        source.close();
        let rankInfo = response[0] || {};
        let rankSongs = response[1] || {};
        let songs = rankSongs.songs || [];
        res.send(resMerge.success({
          data: {
            list: [...songs],
            info: { ...rankInfo },
            page,
            pageSize,
            total: rankSongs.total || 0
          }
        }));
      }).catch(err => {
        source.close();
        res.send(resMerge.error({
          errorMessage: err || '服务器出错'
        }));
      })
    });
  });
}

module.exports = initRank;
