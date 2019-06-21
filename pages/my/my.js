var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bill: false,
        publish: false,
        touxiang: "../../icon/touxiang.png",
        nick_name: "或许是条咸鱼",
        my_goods: "../../icon/my_goods.png",
        goods_word: "我的发布",
        my_like: "../../icon/like.png",
        like_word: "我的收藏",
        my_bill: "../../icon/bill.png",
        bill_word: "我的订单",
        my_comments: "../../icon/comments.png",
        comments_word: "我的动态",
        my_browse: "../../icon/comments.png",
        browse_word: "浏览记录",
        my_about: "../../icon/about.png",
        about_word: "关于我们",
        my_out: "../../icon/warming.png",
        out_word: "退出登录"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        console.log("最后app.globalData.billFresh----" + app.globalData.billFresh);
        console.log("最后app.globalData.pubFresh----" + app.globalData.pubFresh);
        var that = this;
        that.setData({
            bill: app.globalData.billFresh,
            publishment: app.globalData.pubFresh,
            touxiang: app.globalData.userInfo.avatarUrl,
            nick_name: app.globalData.userInfo.nickName
        });
        console.log(app.globalData.userInfo.nickName);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.setData({
            bill: false/*app.globalData.billFresh*/,
            publishment: false/*app.globalData.pubFresh*/,
            "touxiang": app.globalData.userInfo.avatarUrl,
            "nick_name": app.globalData.userInfo.nickName
        });
        app.globalData.billFresh = false;
        app.globalData.pubFresh = false;
        if (!app.globalData.billFresh && !app.globalData.pubFresh) {
            // wx.hideTabBarRedDot({
            //     index: 2,
            //     success: function (res) {
            //         console.log("修改成功");
            //     },
            //     fail: function (error) {
            //         console.log("修改失败");
            //     }
            // })
        }
    },

    /**
     * 点击我的发布触发函数
     */
    to_my_pulish: function (e) {
        wx.navigateTo({
            url: '../my_pulish/my_pulish'
        })
        console.log(JSON.stringify(app.globalData.userInfo));
        console.log(app.globalData.openid);
    },

    /**
     * 点击我的收藏触发函数
     */
    to_my_like: function (e) {
        wx.navigateTo({
            url: '../my_like/my_like'
        })
    },

    /**
      * 增加发布商品
      */
    to_addActive: function (e) {
        wx.navigateTo({
            url: '../my_add/my_add',
        })
    },
    /**
     * 点击我的订单触发函数
     */
    to_my_bill: function (e) {
        wx.navigateTo({
            url: '../my_bill/my_bill'
        })
    },

    /**
     * 点击我的信息触发函数
     */
    to_my_info: function (e) {
        wx.navigateTo({
            url: '../my_info/my_info'
        })
    },


    /**
     * 点击我的动态触发函数
     */
    to_my_comments: function (e) {
        wx.navigateTo({
            url: '../my_comments/my_comments'
        })
    },

    /**
     * 点击关于我们触发函数
     */
    to_my_about: function (e) {
        wx.navigateTo({
            url: '../my_about/my_about'
        })
    },

    /**
     * 点击退出登录触发函数
     */
    getout: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '亲，您真的不要小跳了吗？',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    wx.setStorage({
                        key: "userInfo",
                        data: null
                    });
                    wx.setStorage({
                        key: "user_openid",
                        data: ""
                    });
                    that.setData({
                        touxiang: "../../icon/touxiang.png",
                        nick_name: "或许十条咸鱼"
                    })
                    app.globalData.userInfo = null;
                    app.globalData.openid = "";
                    app.globalData.userSchool = null;
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        })
    },

    /**
     * 获取用户的openId
     */
    getOpenId: function () {
        var that = this;
    }
});

