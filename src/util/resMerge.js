/**
 * Created by mugongxu on 2019/7/23.
 * 返回信息处理
 */
// 失败处理
exports.error = (obj) => {
  const errorObj = {
    errorCode: 99,
    errorMessage: '服务器出错',
    status: -1,
    success: false,
    data: null
  };
  // 合并
  let newErrorObj = Object.assign({}, errorObj, obj);
  return newErrorObj;
};

// 成功处理
exports.success = (obj) => {
  const successObj = {
    errorCode: null,
    errorMessage: null,
    status: 0,
    success: true,
    data: {}
  };
  // 合并
  let newSuccessObj = Object.assign({}, successObj, obj);
  return newSuccessObj;
};
