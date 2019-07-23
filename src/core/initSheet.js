/**
 * Created by mugongxu on 2019/7/18.
 * 歌单接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');
const util = require('../util/index.js');
const resMerge = require('../util/resMerge.js');

const initSheet = (app) => {
  // 音乐歌单
  app.get(api.plistIndex.url, (req, res) => {
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
      };
      // 获取数据
      util.getDataByPage(db, 'sheet', {}, page, pageSize, (err, data) => {
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
      })
    });
  });

  // 歌单下音乐
  app.get(api.plistList.url, (req, res) => {
    // 传参
    const query = req.query;
    const specialid = Number(query.specialid || 0);
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    if (!specialid) {
      res.send(resMerge.error({
        errorMessage: 'specialid不允许为空'
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
        util.getSingleInfo(db, 'sheet', {
          specialid: specialid
        }, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      const getList = new Promise((resolve, reject) => {
        // 获取数据
        util.getDataByPage(db, 'sheetIndex', {
          specialid: specialid 
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
        let sheetInfo = response[0] || {};
        let sheetSongs = response[1] || {};
        let songs = sheetSongs.songs || []
        res.send(resMerge.success({
          data: {
            list: [...songs],
            info: { ...sheetInfo },
            page,
            pageSize,
            total: sheetSongs.total || 0
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

module.exports = initSheet;
