/**
 * Created by mugongxu on 2019/7/23.
 * 公共方法
 */
// 获取分页数据
exports.getDataByPage = (db, colName, query = {}, page, pageSize, callback) => {
  // 获取总数
  db.collection(colName).countDocuments(query, (err, docs) => {
    if (err) {
      callback(err, null);
      return;
    }
    let total = docs;
    // 获取数据
    const skipNum = (page - 1) * pageSize;
    db.collection(colName)
    .find(query)
    .skip(skipNum).limit(pageSize)
    .toArray((err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      result = (result || []).map(item => {
        delete item._id;
        return {
          ...item
        };
      });
      let data = {
        list: [...result],
        page,
        pageSize,
        total
      };
      callback(null, data);
    });
  });
};

// 获取歌曲信息
exports.getSongInfo = (db, colName, result, callback) => {
  result = result || [];
  // 歌曲查询条件处理
  if (result.length === 0) {
    callback(null, result);
  }
  let orOptions = result.map(item => {
    return {
      hash: item.hash
    };
  });
  db.collection(colName).find({
    $or: [...orOptions]
  }).toArray((err, songs) => {
      if (err) {
        callback(err, null);
        return;
      }
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
      callback(null, songs);
  });
};

// 获取歌手信息
exports.getSingerInfo = (db, colName, result, callback) => {
  result = result || [];
  // 歌曲查询条件处理
  if (result.length === 0) {
    callback(null, result);
  }
  let orOptions = result.map(item => {
    return {
      singerid: item.singerid
    };
  });
  db.collection(colName).find({
    $or: [...orOptions]
  }).toArray((err, singers) => {
      if (err) {
        callback(err, null);
        return;
      }
      singers = singers || [];
      // 控制你需要返回的歌曲字段
      singers = singers.map(item => {
        return {
          singerName: item.singername,
          singerId: item.singerid,
          imgurl: item.imgurl,
          classId: item.classid
        };
      });
      callback(null, singers);
  });
};

// 获取单个数据信息
exports.getSingleInfo = (db, colName, query = {}, callback) => {
  db.collection(colName).find(query).limit(1).toArray((err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    result = (result || []).map(item => {
      delete item._id;
      return {
        ...item
      };
    });
    callback(null, result[0] || {});
  });
}
