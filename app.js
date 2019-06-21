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
    console.log("此函数已运行");
    this.globalData.openid = wx.getStorageSync('user_openid');
    this.globalData.userInfo = wx.getStorageSync('userInfo');
        if(this.globalData.openid&&this.globalData.userInfo){
            console.log("缓存中获取openid成功");

        }else{
            console.log("缓存中获取openid失败");
        }
  },
  globalData: {
      appid: 'wx18cb073aa014de93',
      secret:'870268d6a9a47a30922402945a0179c9',
      userInfo: null,
      userSchool:null,
      openid:null,
      likeArr:[],
      goodsKind:"服饰",
      goods_id:null,
      id:null,
      isLoad:false,
      i:0,
      now:null,
      billFresh:false,
      pubFresh:false
  }
})