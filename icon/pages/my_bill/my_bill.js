//pages/my_bill/my_bill
var app = getApp();
var Bmob = require('../../utils/bmob.js');
Page({
    data: {
        touxiang: '../../icon/touxiang.png',
        nick_name: '或许十条咸鱼',
        pulish_touxaing: '../../icon/close.jpg',
        describ_word: '桔梗同款cosplay衣服，八成新，三公寓门口验货',
        author: '或许没条咸鱼',
        zhaung_mess: 'zhaung_mess_ing',
        zhuang_tai_word: '预定中'
    },
    onLoad: function () {
        var that = this;
        var Goods = Bmob.Object.extend("Users");
        var goods = new Bmob.Query(Goods);
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
                    like = object.get('myBuy');
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
                                if (object.id == like[j]) {
                                    var goods_obj = {};
                                    goods_obj.author = object.get("sellerName");
                                    goods_obj.describ_word = object.get("miaoSu");
                                    goods_obj.imgs = object.get("goodsImg0");
                                    goods_obj.post_id = object.id;
                                    goods_obj.zhuang_tai_word = "预定中";
                                    goods_arry[count] = goods_obj;
                                    count++;
                                }
                            }
                        }
                        console.log("共查询到" + count + "条记录" + like);
                        goods_arry.reverse();
                        that.setData({
                            "goods_num": goods_arry
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
            touxiang: app.globalData.userInfo.avatarUrl,
            nick_name: app.globalData.userInfo.nickName
        });
    },
    onShow: function () {
        this.onLoad();
    },
    //用于记录开始触摸的初始点
    touch_s: function (e) {
        if (e.touches.length == 1) {
            this.setData({
                startX: e.touches[0].clientX
            })
        }
    },
    //触摸结束
    touch_e: function (e) {
        if (e.touches.length == 1) {
            console.log("开始运行");
            var endX = e.touches[0].clientX;
            var cha = this.data.startX - endX;
            var end_style = "right:0px";
            if (cha < 60) {
                end_style = "right:0px";
            } else {
                end_style = "right:100px";
            }
            var index = e.currentTarget.dataset.index;
            var goods_num = this.data.goods_num;
            console.log("结束" + index + mov_style + JSON.stringify(e.currentTarget));
            goods_num[index].mov_style = end_style;
            this.setData({
                "goods_num": goods_num
            })
        }
    },
    //用户开始移动时候
    touch_m: function (e) {
        var that = this;
        var mov_style = "right:0px";
        if (e.touches.length == 1) {
            var movX = e.touches[0].clientX;
            var cha = that.data.startX - movX;
            console.log(cha);
            if (cha <= 0) {
                mov_style = "right:0px";
            } else {
                if (cha <= 60) {
                    mov_style = "right:" + cha + "px";
                } else {
                    if (cha > 60 && cha <= 100) {
                        mov_style = "right:" + cha + "px";
                    } else {
                        if (cha > 100) {
                            mov_style = "right:100px";
                        }
                    }
                }

            }
            var index = e.currentTarget.dataset.index;
            var goods_num = this.data.goods_num;
            console.log(index + mov_style + JSON.stringify(e.currentTarget));
            goods_num[index].mov_style = mov_style;
            this.setData({
                "goods_num": goods_num
            })
        }
    },
    del_message: function (e) {
        var ids = e.currentTarget.dataset.post_id;
        console.log(ids);
        var Goods = Bmob.Object.extend("Goods");
        var goods = new Bmob.Query(Goods);
        var that = this;
        wx.showModal({
            title: '提示',
            content: '亲，真的不预定该商品了吗？',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    var User = Bmob.Object.extend("Users");
                    //创建查询对象，入口参数是对象类的实例
                    var user = new Bmob.Query(User);
                    //查询单条数据，第一个参数是这条数据的objectId值
                    user.get(app.globalData.id, {
                        success: function (result) {
                            // 查询成功，调用get方法获取对应属性的值
                            var title = result.get("title");
                            var content = result.get("content");
                            console.log("查询成功" + e.currentTarget.dataset.post_id);
                            result.remove("myBuy",e.currentTarget.dataset.post_id);
                            result.save({ success: function (result) {
                                console.log("删除成功");
                                var index = e.currentTarget.dataset.index;
                                var goods_num = that.data.goods_num;
                                goods_num.splice(index, 1);
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 2000,
                                    success: function () {
                                        setTimeout(function () {
                                            that.setData({
                                                "goods_num": goods_num
                                            })
                                        }, 2000)
                                    }
                                });
                            }
                            });
                        },
                        error: function (object, error) {
                            // 查询失败
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        })
        //查询单条数据，第一个参数是这条数据的objectId值
    },
    to_goods: function (e) {
        var post_id = e.target.dataset.post_id;
        console.log(post_id);
        wx.navigateTo({
            url: '../goods/goods?post_id=' + post_id
        })
    }
})