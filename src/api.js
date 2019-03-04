// 需要请求的API
const proxy = '/km';
const api = [
  // 音乐新歌榜
  { url: proxy + '/banner', link: 'http://m.kugou.com/?json=true', method: 'GET' },
  // 音乐歌单
  { url: proxy + '/plist/index', link: 'http://m.kugou.com/plist/index&json=true', method: 'GET' },
  // 歌单下音乐列表
  { url: proxy + '/plist/list', link: 'http://m.kugou.com/plist/list/125032?json=true', method: 'GET' },
  // 音乐排行榜
  { url: proxy + '/rank/list', link: 'http://m.kugou.com/rank/list&json=true', method: 'GET' },
  // 排行榜歌曲列表
  { url: proxy + '/rank/info', link: 'http://m.kugou.com/rank/info', method: 'GET' },
  // 歌手分类
  { url: proxy + '/singer/class', link: 'http://m.kugou.com/singer/class&json=true', method: 'GET' },
  // 歌手列表
  { url: proxy + '/singer/list', link: 'http://m.kugou.com/singer/list/', method: 'GET', linkKey: 'classid' },
  // 歌手信息
  { url: proxy + '/singer/info', link: 'http://m.kugou.com/singer/info/', method: 'GET', linkKey: 'singerid' },
  // 歌曲详情
  { url: proxy + '/song/info', link: 'http://m.kugou.com/app/i/getSongInfo.php', method: 'GET' },
  // 歌曲详情 - 带歌词
  { url: proxy + '/song/detail', link: 'http://m.kugou.com/yy/index.php', method: 'GET' },
  // 热门搜索列表
  { url: proxy + '/search/hot', link: 'http://mobilecdn.kugou.com/api/v3/search/hot', method: 'GET' },
  // 音乐搜索
  { url: proxy + '/search/song', link: 'http://mobilecdn.kugou.com/api/v3/search/song', method: 'GET' }
];

module.exports = api;
