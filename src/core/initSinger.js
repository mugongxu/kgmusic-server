/**
 * Created by mugongxu on 2019/7/18.
 * 歌手接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');
const util = require('../util/index.js');
const resMerge = require('../util/resMerge.js');

const initSinger = (app) => {
  // 歌手分类
  app.get(api.singerClass.url, (req, res) => {
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
      util.getDataByPage(db, 'singerClass', {}, page, pageSize, (err, data) => {
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

  // 歌手分类下歌手
  app.get(api.singerList.url, (req, res) => {
    // 传参
    const query = req.query;
    const classId = Number(query.classId || 0);
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    if (!classId) {
      res.send(resMerge.error({
        errorMessage: 'classId不允许为空'
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
      // 获取数据
      util.getDataByPage(db, 'singerIndex', {
        classid: classId
      }, page, pageSize, (err, data) => {
        if (err) {
          source.close();
          res.send(resMerge.error({
            errorMessage: err || '服务器出错'
          }));
          return;
        }
        // 获取歌手
        let total = data.total;
        let list = data.list;
        util.getSingerInfo(db, 'singer', list, (err, singers) => {
          source.close();
          if (err) {
            res.send(resMerge.error({
              errorMessage: err || '服务器出错'
            }));
            return;
          };
          res.send(resMerge.success({
            data: {
              list: [...singers],
              page,
              pageSize,
              total
            }
          }));
        });
      });
    });
  });

  // 歌手下歌曲
  app.get(api.singerInfo.url, (req, res) => {
    // 传参
    const query = req.query;
    const singerId = Number(query.singerId || 0);
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    if (!singerId) {
      res.send(resMerge.error({
        errorMessage: 'singerId不允许为空'
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
        util.getSingleInfo(db, 'singer', {
            singerid: singerId
        }, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      const getList = new Promise((resolve, reject) => {
        // 获取数据
        util.getDataByPage(db, 'songs', {
            singerId: singerId
        }, page, pageSize, (err, data) => {
          if (err)  reject(err);
          // 获取歌曲
          let total = data.total;
          let list = data.list.map(item => {
            return {
              hash: item.hash,
              filename: item.filename,
              duration: item.duration,
              addtime: item.addtime,
              remark: item.remark,
              fileSize: item.fileSize,
              singerName: item.singerName,
              singerId: item.singerId
            };
          });
          resolve({
            songs: [...list],
            total
          });
        });
      });
      // 数据处理
      Promise.all([getInfo, getList]).then(response => {
        source.close();
        let singerInfo = response[0] || {};
        let singerSongs = response[1] || {};
        let songs = singerSongs.songs || []
        res.send(resMerge.success({
          data: {
            list: [...songs],
            info: { ...singerInfo },
            page,
            pageSize,
            total: singerSongs.total || 0
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

module.exports = initSinger;
