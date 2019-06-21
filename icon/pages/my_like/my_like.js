//pages/my_like/my_like.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
Page({
    data: {
        touxiang: '../../icon/touxiang.png',
        nick_name: '或许十条咸鱼',
        pulish_touxaing: '../../icon/close.jpg',
        describ_word: '桔梗同款cosplay衣服，八成新，三公寓门口验货',
        author: '或许十条咸鱼'
    },
    onLoad: function () {
        var that = this;
        var Goods = Bmob.Object.extend("Users");
        var goods = new Bmob.Query(Goods);
        goods.find({
            success: function (res) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].get("openId") == app.globalData.openid) {
                        that.setData({
                            "userInfoId": res[i].id,
                        })
                    }
                }
            }
        })
        goods.equalTo("openId", app.globalData.openid);
        // 查询所有数据
        goods.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                var like_num = 0;
                var like = [];
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    like = object.get('likeGoods');
                    like_num = object.get('likeGoods').length;
                }
                var goods_arry = [];
                var Goods = Bmob.Object.extend("Goods");
                var goods = new Bmob.Query(Goods);
                // 查询所有数据
                goods.find({
                    success: function (results) {
                        var count = 0;
                        // 循环处理查询到的数据
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            for (var j = 0; j < like.length; j++) {
                                var goods_obj = {};
                                if (object.id == like[j]) {
                                    goods_obj.author = object.get("sellerName");
                                    goods_obj.describ_word = object.get("miaoSu");
                                    goods_obj.post_id = object.id;
                                    goods_obj.imgs = object.get("goodsImg0");
                                    goods_obj.likeImg = "../../icon/like_red.png",
                                    goods_arry[count] = goods_obj;
                                    count++;
                                }
                            }
                        }
                        console.log("共查询到" + count + "条记录" + like);
                        goods_arry.reverse();
                        that.setData({
                            "menu": goods_arry
                        })
                    },
                    error: function (error) {
                        console.log("查询失败: " + error.code + " " + error.message);
                    }
                });
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        that.setData({
            "touxiang": app.globalData.userInfo.avatarUrl,
            "nick_name": app.globalData.userInfo.nickName,
        });
    },
    onShow: function () {
        this.onLoad();
    },

    /**
     * 收藏与取消收藏
     */
    to_like: function (e) {
        var that = this;
        console.log(e);
        var userObjId = e.currentTarget.id;
        console.log(userObjId);
        var goodsObjId = e.target.id;
        console.log(goodsObjId);
        var like = [];
        var goods_obj = {};
        var goods_arry = [];
        wx.showModal({
            title: '提示',
            content: '你不喜欢我了么',
            success: function (res) {
                if (res.confirm) {
                    var Users = Bmob.Object.extend("Users");
                    var user = new Bmob.Query(Users);
                    user.get(userObjId, {
                        success: function (result) {
                            result.remove("likeGoods", goodsObjId);
                            result.save();
                            var Goods = Bmob.Object.extend("Users");
                            var goods = new Bmob.Query(Goods);
                            goods.find({
                                success: function (res) {
                                    for (var i = 0; i < res.length; i++) {
                                        if (res[i].get("openId") == app.globalData.openid) {
                                            that.setData({
                                                "userInfoId": res[i].id,
                                            })
                                        }
                                    }
                                }
                            })
                            goods.equalTo("openId", app.globalData.openid);
                            // 查询所有数据
                            goods.find({
                                success: function (results) {
                                    console.log("共查询到 " + results.length + " 条记录");
                                    var like_num = 0;
                                    var like = [];
                                    // 循环处理查询到的数据
                                    for (var i = 0; i < results.length; i++) {
                                        var object = results[i];
                                        like = object.get('likeGoods');
                                        like_num = object.get('likeGoods').length;
                                    }
                                    var goods_arry = [];
                                    var Goods = Bmob.Object.extend("Goods");
                                    var goods = new Bmob.Query(Goods);
                                    // 查询所有数据
                                    goods.find({
                                        success: function (results) {
                                            var count = 0;
                                            // 循环处理查询到的数据
                                            for (var i = 0; i < results.length; i++) {
                                                var object = results[i];
                                                for (var j = 0; j < like.length; j++) {
                                                    var goods_obj = {};
                                                    if (object.id == like[j]) {
                                                        count++;
                                                        goods_obj.author = object.get("sellerName");
                                                        goods_obj.describ_word = object.get("miaoSu");
                                                        goods_obj.goodsId = object.id;
                                                        goods_obj.imgs = object.get("goodsImg0");
                                                        goods_obj.likeImg = "../../icon/like_red.png",
                                                            goods_arry[j] = goods_obj;
                                                    }
                                                }
                                            }
                                            console.log("共查询到" + count + "条记录" + like);
                                            goods_arry.reverse();
                                            that.setData({
                                                "menu": goods_arry
                                            })
                                        },
                                        error: function (error) {
                                            console.log("查询失败: " + error.code + " " + error.message);
                                        }
                                    });
                                },
                                error: function (error) {
                                    console.log("查询失败: " + error.code + " " + error.message);
                                }
                            });
                        },
                        error: function (error) {
                            console("获取user出错" + error);
                        }
                    })
                } else {
                    console.log("用户点击取消");
                }
            },
            fail: function (error) {
                console.log("弹窗出错" + error);
            }
        })
    }
    //   to_goods: function (e) {
    //       var post_id = e.target.dataset.post_id;
    //       console.log(post_id);
    //       wx.navigateTo({
    //           url: '../goods/goods?post_id=' + post_id
    //       })
    //   }
})
