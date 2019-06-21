//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
const app = getApp();
Page({
    data: {
        hasUserInfo: false,
        is_live: "live",
        is_openid: "no_openid",
        nick_name: "微信昵称",
        avatar: "../../icon/touxiang.png",
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        billFresh: false,
        pubFresh: false,
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        var that = this;
        if (app.globalData.openid && app.globalData.userInfo) {
            that.setData({
                avatar: app.globalData.userInfo.avatarUrl,
                nick_name: app.globalData.userInfo.nickName
            })
            wx.showToast({
                title: '获取成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                    setTimeout(function () {
                        wx.switchTab({
                            url: '../girl/girl',
                        })
                    }, 2000)
                }
            });
        } else {
            that.setData({
                is_live: "unlive",
                is_openid: "un_no_openid"
            })
        }
        // var myOpenId = app.globalData.openid;
        var myOpenId = app.globalData.openid;
        // var myId = "ca4b2f7285";
        console.log("myopenId---" + myOpenId);
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var now = year + "-" + month + "- " + day;
        app.globalData.now = now;
        now = parseInt(now);
        console.log(now);
        var Users = Bmob.Object.extend("Users");
        var user = new Bmob.Query(Users);
        var myBuy = [];
        // 查询所有数据
        //判断订单更新（订单截止时间是否到期）
        user.find({
            success: function (results) {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].get("openId") == myOpenId) {
                        var like_num = 0;
                        // 循环处理查询到的数据
                        myBuy = results[i].get('myBuy');
                        break;
                    }
                }
                if (myBuy == null) {
                    // break;
                } else {
                    console.log("results.get('myBuy').length----" + results[i].get('myBuy').length);
                    // 查询所有数据
                    var Goods = Bmob.Object.extend("Goods");
                    var goods = new Bmob.Query(Goods);
                    goods.find({
                        success: function (results) {
                            console.log("订单goods共查询到 " + results.length + " 条记录");
                            var count = 0;
                            // 循环处理查询到的数据
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                for (var j = 0; j < myBuy.length; j++) {
                                    if (object.id == myBuy[j]) {
                                        count++;
                                        console.log("id符合");
                                        var time = Date.parse(new Date(object.get("time")));
                                        var diff = now - time;
                                        if ((diff > 0) && (diff < 86400000)) {
                                            app.globalData.billFresh = true;
                                            that.setData({
                                                billFresh: true,
                                            })
                                            console.log("app.globalData.billFresh1---" + app.globalData.billFresh);
                                            break;
                                        } else {
                                            app.globalData.billFresh = false;
                                            that.setData({
                                                billFresh: false,
                                            })
                                            console.log("app.globalData.billFresh1---" + app.globalData.billFresh);
                                        }
                                    }
                                }
                            }
                        },
                        error: function (error) {
                            console.log("1查询失败: " + error.code + " " + error.message);
                        }
                    });
                }
            },
            error: function (error) {
                console.log("2查询失败: " + error1.code + " " + error1.message);
                // console.log("2查询失败");
            }
        });
        //判断发布更新（是否有人预定）
        var Goods = Bmob.Object.extend("Goods");
        var goods = new Bmob.Query(Goods);
        var goodsObj = [];
        goods.find({
            success: function (result) {
                console.log("发布更新goods共查询到 " + result.length + " 条记录");
                for (var i = 0; i < result.length; i++) {
                    var object = result[i]
                    if ((object.get("openId") == myOpenId) && ((Date.parse(new Date(object.get("time"))) - now) > 0)) {
                        console.log("时间未过期和id符合，装载");
                        console.log("符合商品id" + object.id)
                        goodsObj.push(object.id);
                    }
                }
                console.log("符合发布初级条件goodsObj.length-----" + goodsObj.length);
                var Users = Bmob.Object.extend("Users");
                var user = new Bmob.Query(Users);
                user.find({
                    success: function (result) {
                        console.log("发布user更新共查询到 " + result.length + " 条记录");
                        for (var i = 0; i < result.length; i++) {
                            var likeObj = result[i].get("myBuy");
                            console.log("result.id----" + result[i].id);
                            if (likeObj != null) {
                                // console.log("likeObj----" + likeObj.length);
                                // console.log("goodsObj----" + goodsObj.length);
                                for (var j = 0; j < likeObj.length; j++) {
                                    for (var k = 0; k < goodsObj.length; k++) {
                                        // console.log("比较" + likeObj[j] + "----" + goodsObj[k]);
                                        if (likeObj[j] == goodsObj[k]) {
                                            console.log("有人买")
                                            app.globalData.pubFresh = true;
                                            that.setData({
                                                pubFresh: true,
                                            })
                                            console.log("我的加红点");
                                            break;
                                        }
                                    }
                                }
                            } else {
                                console.log("result[i].id----" + result[i].id);
                                if (app.globalData.pubFresh) {
                                    app.globalData.pubFresh
                                } else {
                                    app.globalData.pubFresh = false;
                                    that.setData({
                                        pubFresh: false,
                                    })
                                }
                                // console.log("app.globalData.pubFresh1成功---" + app.globalData.pubFresh);
                            }
                            //   console.log("比较值2++++" + app.globalData.pubFresh);
                        }
                    },
                    error: function (error) {
                        console.log("goods查询失败")
                    }
                })
            },
            error: function (error) {
                console.log("goods查询失败")
            }
        });
        console.log("app.globalData.billFresh" + app.globalData.billFresh);
        console.log("app.globalData.pubFresh" + app.globalData.pubFresh);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // var that = this;
        // console.log("最后app.globalData.billFresh----" + app.globalData.billFresh);
        // console.log("最后app.globalData.pubFresh----" + app.globalData.pubFresh);
        // console.log("最后比较值a---" + that.data.billFresh);
        // console.log("最后比较值b---" + that.data.pubFresh);
        // // 判断订单更新（订单截止时间是否到期）和发布更新（是否有人预定），在我的顯示小紅點
        // if (app.globalData.billFresh || app.globalData.pubFresh) {
        //   wx.showTabBarRedDot({
        //     index: 2,
        //     success: function (res) {
        //       console.log("我的已加红点")
        //     },
        //     fail: function (error) {
        //       wx.showModal({
        //         title: '提示',
        //         content: '当前微信版本过低，为了您能有更好的体验，请升级到最新微信版本。',
        //       })
        //     }
        //   })
        // }
    },
    //在没有openid的情况下 
    no_openid: function () {
        wx.showToast({
            title: '正在进入',
            icon: 'success',
            duration: 2000,
            success: function () {
                setTimeout(function () {
                    wx.switchTab({
                        url: '../girl/girl',
                    })
                }, 2000)
            }
        });
    },
    /**
     * 点击获取用户信息
     */
    get_user_info: function (e) {
        var that = this;
        //判断本地用户信息是否存在
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
            console.log("缓存中获取用户信息成功");
            wx.redirectTo({
                url: '../girl/girl',
            });
        } else if (this.data.canIUse) {
            wx.login({
                //获取code
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        console.log(res.code)
                        Bmob.User.requestOpenId(res.code, {
                            success: function (result) {
                                app.globalData.openid = result.openid;
                                // 获取用户的唯一表示openid以及用户信息userInfo并存入相对应的全局变量中
                                app.globalData.openid = result.openid;
                                console.log('openid为' + app.globalData.openid);
                                // app.globalData.userInfo = JSON.stringify(e.detail.rawData).replace(/\\/g,"");
                                app.globalData.userInfo = JSON.parse(e.detail.rawData);
                                if (app.globalData.userInfo && app.globalData.openid) {
                                    that.setData({
                                        avatar: app.globalData.userInfo.avatarUrl,
                                        nick_name: app.globalData.userInfo.nickName
                                    })
                                    console.log("信息获取且赋值成功");
                                    wx.setStorage({
                                        key: "userInfo",
                                        data: app.globalData.userInfo
                                    });
                                    wx.setStorage({
                                        key: "user_openid",
                                        data: result.openid
                                    });
                                    wx.showToast({
                                        title: '成功',
                                        icon: 'success',
                                        duration: 2000,
                                        success: function () {
                                            setTimeout(function () {
                                                wx.switchTab({
                                                    url: '../girl/girl',
                                                })
                                            }, 2000)
                                        }
                                    });
                                } else {
                                    console.log("信息获取成功但赋值失败");
                                }
                            },
                            error: function (error) {
                                // Show the errormessage somewhere
                                console.log("Error:" + error.code + " " + error.message);
                            }
                        });
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                        common.showTip('获取用户登录态失败！', 'loading');
                        wx.switchTab({
                            url: '../girl/girl',
                        })
                    }
                }
            });


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
                    wx.switchTab({
                        url: '../girl/girl',
                    });
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
