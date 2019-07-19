// 需要请求的API
const proxy = '/km';
const api = {
  // 音乐新歌榜
  banner: { url: proxy + '/banner', method: 'GET' },
  // 音乐歌单
  plistIndex: { url: proxy + '/plist/index', method: 'GET' },
  // 歌单下音乐列表
  plistList: { url: proxy + '/plist/list', method: 'GET' },
  // 音乐排行榜
  rankIndex: { url: proxy + '/rank/list', method: 'GET' },
  // 排行榜歌曲列表
  rankInfo: { url: proxy + '/rank/info', method: 'GET' },
  // 歌手分类
  singerClass: { url: proxy + '/singer/class', method: 'GET' },
  // 歌手列表
  singerList: { url: proxy + '/singer/list', method: 'GET' },
  // 歌手信息
  singerInfo: { url: proxy + '/singer/info', method: 'GET' },
  // 歌曲详情
  songInfo: { url: proxy + '/song/info', method: 'GET' },
  // 歌曲详情 - 带歌词
  songDetail: { url: proxy + '/song/detail', method: 'GET' },
  // 热门搜索列表
  hotSearch: { url: proxy + '/search/hot', method: 'GET' },
  // 音乐搜索
  search: { url: proxy + '/search/song', method: 'GET' }
};

module.exports = api;
