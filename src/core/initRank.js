/**
 * Created by mugongxu on 2019/7/18.
 * 首页接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');

const initRank = (app) => {
  // 排行榜
  app.get(api.rankIndex.url, (req, res) => {
    // 传参
    const query = req.query;
    // 连接数据库
    connectDB((db, source) => {
      if (!db) reject(source);
      db.collection('rank').find().toArray((err, result) => {
        source.close();
        if (err) {
          res.send({
            errorCode: 99,
            errorMessage: err || '服务器出错',
            status: -1,
            success: false,
            data: null
          });
          return;
        }
        result = (result || []).map(item => {
          delete item._id;
          return {
            ...item
          };
        });
        res.send({
          errorCode: null,
          errorMessage: null,
          status: 0,
          success: true,
          data: { list: [..result] }
        });
      });
    });
  });

  // 排行榜详情
  app.get(api.rankInfo.url, (req, res) => {
    // 传参
    const query = req.query;
    const rankId = query.rankId;
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    if (!rankId) {
      res.send({
        errorCode: 99,
        errorMessage: 'rankId不允许为空',
        status: -1,
        success: false,
        data: null
      });
      return;
    }
    // 连接数据库
    connectDB((db, source) => {
      if (!db) {
        res.send({
          errorCode: 99,
          errorMessage: source,
          status: -1,
          success: false,
          data: null
        });
        return;
      };
      const getInfo = new Promise((resolve, reject) => {
        db.collection('rank').find({ rankid: rankId }).limit(1).toArray((err, result) => {
          if (err) reject(err);
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
      const getList = new Promise((resolve, reject) => {
        db.collection('rankIndex')
        .find({ rankid: rankId })
        .skip((page - 1) * pageSize).limit(pageSize)
        .toArray((err, result) => {
          if (err)  reject(err); 
          result = result || [];
          // 歌曲查询条件处理
          if (result.length === 0) {
            resolve([]);
          }
          let orOptions = result.map(item => {
            return {
              hash: item.hash
            };
          });
          db.collection('songs').find({
            $or: [...orOptions]
          }).toArray((err, songs) => {
              source.closre();
              if (err) reject(err);
              songs = songs || [];
              // 控制你需要返回的歌曲字段
              songs = songs.map(item => {
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
              resolve(songs);
          });
        });
      });
    });
  });
}

module.exports = initRank;
