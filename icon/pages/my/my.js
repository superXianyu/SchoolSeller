// pages/my/my.js
var app=getApp();
Page({
    data: {
        touxiang:"../../icon/touxiang.png",
       nick_name:"或许是条咸鱼",
       my_goods:"../../icon/my_goods.png",
       goods_word:"我的发布",
       my_like: "../../icon/like.png",
       like_word: "我的收藏",
       my_bill: "../../icon/bill.png",
       bill_word: "我的订单",
       my_browse: "../../icon/browse.png",
       browse_word: "浏览记录",
       my_about: "../../icon/about.png",
       about_word: "关于我们",
       my_out: "../../icon/warming.png",
       out_word: "退出登录"
    },
    onLoad:function(){
        var that = this;
                that.setData({
                    touxiang: app.globalData.userInfo.avatarUrl,
                    nick_name: app.globalData.userInfo.nickName
                });
                console.log(app.globalData.userInfo.nickName);
    },
    to_my_pulish:function(e){
        wx.navigateTo({
            url:'../my_pulish/my_pulish'
        })
        console.log(JSON.stringify(app.globalData.userInfo));
        console.log(app.globalData.openid);
    },
    to_my_like:function(e){
        wx.navigateTo({
            url:'../my_like/my_like'
        })
    },
    to_my_bill: function (e) {
      wx.navigateTo({
        url: '../my_bill/my_bill'
      })
    },
    to_my_info: function (e) {
      wx.navigateTo({
        url: '../my_info/my_info'
      })
    },
    to_my_about:function(e){
        wx.navigateTo({
            url:'../my_about/my_about'
        })
    },
    getout:function(e){
        wx.showModal({
            title: '提示',
            content: '亲，您真的不要小跳了吗？',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }  
        })
    },
    getOpenId: function () {
        var that = this;
    }
});

