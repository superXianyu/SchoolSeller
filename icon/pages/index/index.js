//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
const app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
            wx.redirectTo({
                url: '../girl/girl',
            });
        } else if (this.data.canIUse) {
            wx.showModal({
                title: '提示',
                content: '亲，请允许我们获取您的信息',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        wx.login({
                            //获取code
                            success: function (res) {
                                var code = res.code; //返回code
                                var appId = app.globalData.appid;
                                var secret = app.globalData.secret;
                                wx.request({
                                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
                                    data: {},
                                    header: {
                                        'content-type': 'json'
                                    },
                                    success: function (res) {
                                        var openid = res.data.openid //返回openid
                                        console.log('openid为' + openid);
                                        app.globalData.openid = openid;
                                        wx.switchTab({
                                            url: '../girl/girl',
                                        });
                                    }
                                });
                            }
                        })
                        wx.getUserInfo({
                            success: function (ret) {
                                app.globalData.userInfo = ret.userInfo;
                            }
                        })
                        

                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        };
    },
    /**
 * 用户点击右上角分享
 */
    onShareAppMessage: function () {
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    } 
})
