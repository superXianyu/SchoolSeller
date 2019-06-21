//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("b12a85205745c34d1e4e1c278089bd8a", "9e9a4c513ea6b34105823f039dc7ecff");
var openid;
var user_mess;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },
  globalData: {
      appid: 'wx18cb073aa014de93',
      secret:'c620b8362c3f3fa9a7d7881a4d5c15ea',
      userInfo: null,
      useerSchool:null,
      openid:null,
      likeArr:[],
      goodsKind:"服饰",
      goods_id:null,
      id:null,
      isLoad:false,
      i:0
  }
})