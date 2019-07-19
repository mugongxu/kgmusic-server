/**
 * Created by mugongxu on 2019/7/18.
 * 首页接口初始化
 */
const api = require('../config/api.js');
const connectDB = require('../util/connectDB.js');

const initBanner = (app) => {
  app.get(api.banner.url, (req, res) => {
    // 传参
    const query = req.query;
    Promise.all([getBannerList(), getUptodateList()]).then(response => {
      let newInfo = { banner: response[0], data: response[1] };
      res.send({
        errorCode: null,
        errorMessage: null,
        status: 0,
        success: true,
        data: { ...newInfo }
      });
    }).catch(err => {
      res.send({
        errorCode: 99,
        errorMessage: err || '服务器出错',
        status: -1,
        success: false,
        data: null
      });
    });
  });
}

const getBannerList = () => {
  return new Promise((resolve, reject) => {
    // 连接数据库
    connectDB((db, source) => {
      if (!db) reject(source);
      db.collection('banner').find().toArray((err, result) => {
        source.close();
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
  });
}

const getUptodateList = () => {
  return new Promise((resolve, reject) => {
    // 连接数据库
    connectDB((db, source) => {
      if (!db) reject(source);
      db.collection('uptodate').find().toArray((err, result) => {
        if (err) {
          source.close();
          reject(err);
        }
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
            source.close();
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
}

module.exports = initBanner;
