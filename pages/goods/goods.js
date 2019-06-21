
// pages/goods/goods.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
var like = [];
var slide_imgs = [];
Page({
    /**
     * 页面的初始数据
     */
    data: {
        slider: [
        ],
        // price: '108',
        // is_new: '八成新',
        // sex: '♀',
        // category: '衣物',
        // describ_word: '桔梗同款cosplay衣服，八成新，三公寓门口验货',
        // school: '吉林建筑大学',
        // adress: '十一公寓楼下',
        // time: '2018-04-03 11:00',
        // seller_img: '../../icon/touxiang.png',
        // nick_name: '或许十条咸鱼',
        // seller_sex: '♀',
        // seller_age: '22',
        // user_id: null,
        likeImg: '../../icon/like_gray.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        app.globalData.goods_id = options.post_id;
        var Goods = Bmob.Object.extend("Goods");
        //创建查询对象，入口参数是对象类的实例
        var goods = new Bmob.Query(Goods);
        //查询单条数据，第一个参数是这条数据的objectId值
        goods.get(app.globalData.goods_id, {
            success: function (result) {
                // 查询成功，调用get方法获取对应属性的值

                var count = 0;
                for (var i = 0; i < 6; i++) {
                    if (result.get("goodsImg" + i + "")) {
                        slide_imgs.push(result.get("goodsImg" + i + ""));
                    }
                }
                wx.showLoading({
                    title: '加载中',
                    duration: 500,
                    success:function(){
                        setTimeout(function(){
                            that.setData({
                                "price": result.get("price"),
                                "is_new": result.get("isNew"),
                                "category": result.get("kind"),
                                "school": app.globalData.userSchool,
                                "adress": result.get("place"),
                                "time": result.get("time"),
                                "nick_name": result.get("sellerName"),
                                "describ_word": result.get("miaoSu"),
                                "seller_img": result.get("avatarUrl"),
                                "slider": slide_imgs,
                                "goodsId": options.post_id,
                            })
                        })
                    ,500}
                })
            },
            error: function (object, error) {
                // 查询失败
            }
        });
        var Users = Bmob.Object.extend("Users");
        var users = new Bmob.Query(Users);
        users.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get('title'));
                    if (object.get('openId') == app.globalData.openid) {
                        like = object.get('likeGoods');
                    }
                }
                for (var j = 0; j < like.length; j++) {
                    that.setData({
                        "likeImg": '../../icon/like_gray.png',
                    })
                    if (like[j] == options.post_id) {
                        that.setData({
                            "likeImg": '../../icon/like_red.png',
                        })
                        break;
                    }
                }
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            },
        })
    },
    //页面隐藏时
    onUnload: function () {
        slide_imgs = [];
    },
    /**
     * 点击收藏
     */
    to_like: function (e) {
        var that = this;
        var num = 0;
        var num1 = 0;
        var objId = that.data.goodsId;
        var liker = that.data.user_id;
        var Users = Bmob.Object.extend("Users");
        var users = new Bmob.Query(Users);
        users.find({
            success: function (results) {
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get('title'));
                    if (object.get('openId') == app.globalData.openid) {
                        like = object.get('likeGoods');
                        break;
                    }
                }
                if (like == null) {
                    num = 0;
                } else {
                    num = like.length;
                }
                results[i].addUnique("likeGoods", objId);
                results[i].save();
                like = results[i].get('likeGoods');
                num1 = like.length;
                if (num < num1) {
                    that.setData({
                        "likeImg": '../../icon/like_red.png',
                    })
                } else {
                    results[i].remove("likeGoods", objId);
                    results[i].save();
                    that.setData({
                        "likeImg": '../../icon/like_gray.png',
                    })
                }
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            },
        })
    },
    /*
   * "立即预定"函数
   */
    put_to_bill: function () {
        var User = Bmob.Object.extend("Users");
        //创建查询对象，入口参数是对象类的实例
        var user = new Bmob.Query(User);
        //查询单条数据，第一个参数是这条数据的objectId值
        user.get(app.globalData.id, {
            success: function (result) {
                // 查询成功，调用get方法获取对应属性的值
                var like_goods = result.get("myBuy");
                var count = 0;
                if(like_goods){
                    for (var i = 0; i < like_goods.length; i++) {
                        if (like_goods[i] == app.globalData.goods_id) {
                            count++;
                        } 
                        console.log(like_goods[i] + app.globalData.goods_id + "增加值为" + count);
                    }
                }
                if (count == 0) {
                    var User = Bmob.Object.extend("Uers");
                    //创建查询对象，入口参数是对象类的实例
                    var user = new Bmob.Query(User);
                    result.addUnique("myBuy", app.globalData.goods_id);
                    result.save({
                        success: function (ret) {
                            wx.showToast({
                                title: '预定成功',
                                icon: 'success',
                                duration: 2000,
                                success: function () {
                                }
                            });
                        }
                    });
                } else {
                    wx.showToast({
                        title: '您已预定过该物品',
                        icon: 'fail',
                        duration: 2000,
                        success: function () {
                            setTimeout(function () {
                            }, 2000)
                        }
                    });
                }

            },
            error: function (object, error) {
                // 查询失败
            }
        });
    },
    //点击轮播图查看图片
    see_img: function (e) {
        var img_num = e.target.dataset.index;
        console.log(img_num);
        wx.previewImage({
            urls: slide_imgs,
            current: slide_imgs[img_num],
        })
    }
});