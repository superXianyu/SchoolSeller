// pages/girl/girl.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
var goodsArr=[];
Page({
    data: {
        img_navigation_search: '../../icon/search.png',
        img_foot_girl: '../../icon/girl.png',
        imgs: '../../icon/close.jpg',
        goods_word: '桔梗同款cosplay衣服，八成新，三公寓门口验货',
        goods_price: '¥ : 108',
        clothes: 'bar1_2',
        electron: 'bar2_1',
        study: 'bar3_1',
        others: 'bar4_1'
    },
    onLoad: function () {
        app.globalData.goodsKind = "服饰";
        var Users = Bmob.Object.extend("Users");
        var users = new Bmob.Query(Users);
        var count = 0;
        var that=this;
        // 查询所有数据
        users.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get('title'));
                    console.log(app.globalData.openid);
                    //循环查询数据要是存在openid与用户相对应的数据则停止循环
                    if (object.get('openId') == app.globalData.openid) {
                        count++;
                        app.globalData.id = object.id;
                        console.log("查询成功"+app.globalData.id);
                        if(object.get('school')){
                            //查询到用户已经填写学校之后执行查询与用户学校相对应的商品
                            app.globalData.userSchool = object.get("school");
                        }else{
                            //如果不存在学校（用户未填写学校）则跳转到my_info页面填写学校
                            wx.showModal({
                                title: '提示',
                                content: '为不影响您的使用请填写对应学校',
                                success: function (res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定' + app.globalData.id);
                                        wx.navigateTo({
                                            url: '../my_info/my_info',
                                        })
                                    }
                                }
                            })
                        }
                        break;
                    }
                }
                if (count) {
                    console.log("该账户存在");
                    var Goods = Bmob.Object.extend("Goods");
                    var goodss = new Bmob.Query(Goods);
                    // 查询所有数据
                    goodss.find({
                        success: function (results) {
                            var count = 1;
                            console.log("共查询到 " + results.length + " 条记录");
                            console.log(app.globalData.userSchool);
                            // 循环处理查询到的数据
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i];
                                var goodsObj = {};
                                if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                    count++;
                                    goodsObj.goods_word = object.get("miaoSu");
                                    goodsObj.goods_price = object.get("price");
                                    goodsObj.post_id = object.id;
                                    goodsObj.imgs = object.get("goodsImg0");
                                    //    goodsObj.imgs = object.get("goodsImg0");
                                    if (count % 2 == 0) {
                                        goodsObj.goods_class = "goods_box1";
                                    } else {
                                        goodsObj.goods_class = "goods_box2";
                                    }
                                    goodsArr.push(goodsObj);
                                    console.log(JSON.stringify(goodsArr));
                                }
                            }
                            goodsArr.reverse();
                            that.setData({
                                "goods": goodsArr
                            })
                            app.globalData.isLoad = true;
                        },
                        error: function (error) {
                            console.log("查询失败: " + error.code + " " + error.message);
                        }
                    });
                }
                else {
                    if (app.globalData.openid) {
                        var Users = Bmob.Object.extend("Users");
                        var users = new Users();
                        users.set("openId", app.globalData.openid);
                        users.set("avatarUrl", app.globalData.userInfo.avatarUrl);
                        users.set("nickName", app.globalData.userInfo.nickName);
                        //添加数据，第一个入口参数是null
                        users.save(null, {
                            success: function (result) {
                                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                                console.log("日记创建成功, objectId:" + result.id);
                                app.globalData.id = object.id;
                                //由于是初次创建所以直接跳转到my_info页面填写用户学校
                                wx.showModal({
                                    title: '提示',
                                    content: '为不影响您的使用请填写对应学校',
                                    success: function (res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定')
                                            wx.navigateTo({
                                                url: '../my_info/my_info',
                                            })
                                        }
                                    }
                                })
                            },
                            error: function (result, error) {
                                // 添加失败
                                console.log('创建日记失败' + JSON.stringify(error));

                            }
                        });
                       
                    }
                }
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        
    },
    onShow:function(){
        if (app.globalData.isLoad){
            this.to_clothes();
        }
    },
    to_clothes: function (e) {
        var that=this;
        console.log("用户的学校为："+app.globalData.userSchool);
        goodsArr=[];
        var count = 1;
        app.globalData.goodsKind = "服饰";
        var Goods = Bmob.Object.extend("Goods");
        var goodss = new Bmob.Query(Goods);
        // 查询所有数据
        goodss.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                console.log(app.globalData.userSchool);
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var goodsObj = {};
                    if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                        count++;
                        goodsObj.goods_word = object.get("miaoSu");
                        goodsObj.goods_price = object.get("price");
                        goodsObj.imgs = object.get("goodsImg0");
                        goodsObj.post_id = object.id;
                        if (count % 2 == 0) {
                            goodsObj.goods_class = "goods_box1";
                        } else {
                            goodsObj.goods_class = "goods_box2";
                        }
                        goodsArr.push(goodsObj);
                        console.log(JSON.stringify(goodsArr));
                    }
                }
                goodsArr.reverse();
                that.setData({
                    "goods": goodsArr
                })
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        this.setData({
            clothes: 'bar1_2',
            electron: 'bar2_1',
            study: 'bar3_1',
            others: 'bar4_1'
        });
    },
    to_electron: function (e) {
        var that = this;
        goodsArr = [];
        var count=1;
        app.globalData.goodsKind = "电子设备";
        var Goods = Bmob.Object.extend("Goods");
        var goodss = new Bmob.Query(Goods);
        // 查询所有数据
        goodss.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                console.log(app.globalData.userSchool);
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var goodsObj = {};
                    if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                        count++;
                        goodsObj.goods_word = object.get("miaoSu");
                        goodsObj.goods_price = object.get("price");
                        goodsObj.imgs = object.get("goodsImg0");
                        goodsObj.post_id = object.id;
                        if (count % 2 == 0) {
                            goodsObj.goods_class = "goods_box1";
                        } else {
                            goodsObj.goods_class = "goods_box2";
                        }
                        goodsArr.push(goodsObj);
                        console.log(JSON.stringify(goodsArr));
                    }
                }
                goodsArr.reverse();
                that.setData({
                    "goods": goodsArr
                })
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        this.setData({
            clothes: 'bar1_1',
            electron: 'bar2_2',
            study: 'bar3_1',
            others: 'bar4_1'
        });
    },
    to_study: function (e) {
        var that = this;
        goodsArr = [];
        var count=0;
        app.globalData.goodsKind = "学习用品";
        var Goods = Bmob.Object.extend("Goods");   
        var goodss = new Bmob.Query(Goods);
        // 查询所有数据
        goodss.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                console.log(app.globalData.userSchool);
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var goodsObj = {};
                    if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                        goodsObj.goods_word = object.get("miaoSu");
                        goodsObj.goods_price = object.get("price");
                        goodsObj.imgs = object.get("goodsImg0");
                        goodsObj.post_id = object.id;
                        if (count % 2 == 0) {
                            goodsObj.goods_class = "goods_box1";
                        } else {
                            goodsObj.goods_class = "goods_box2";
                        }
                        goodsArr.push(goodsObj);
                        console.log(JSON.stringify(goodsArr));
                    }
                }
                goodsArr.reverse();
                that.setData({
                    "goods": goodsArr
                })
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        this.setData({
            clothes: 'bar1_1',
            electron: 'bar2_1',
            study: 'bar3_2',
            others: 'bar4_1'
        });
    },
    to_others: function (e) {
        app.globalData.goodsKind = "其他";
        var that = this;
        goodsArr = [];
        var count=1;
        var Goods = Bmob.Object.extend("Goods");
        var goodss = new Bmob.Query(Goods);
        // 查询所有数据
        goodss.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                console.log(app.globalData.userSchool);
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var goodsObj = {};
                    if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                        count++;
                        goodsObj.goods_word = object.get("miaoSu");
                        goodsObj.goods_price = object.get("price");
                        goodsObj.imgs = object.get("goodsImg0");
                        goodsObj.post_id = object.id;
                        if (count % 2 == 0) {
                            goodsObj.goods_class = "goods_box1";
                        } else {
                            goodsObj.goods_class = "goods_box2";
                        }
                        goodsArr.push(goodsObj);
                        console.log(JSON.stringify(goodsArr));
                    }
                }
                goodsArr.reverse();
                that.setData({
                    "goods": goodsArr
                })
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        this.setData({
            clothes: 'bar1_1',
            electron: 'bar2_1',
            study: 'bar3_1',
            others: 'bar4_2'
        });
    },
    to_goods: function (e) {
        console.log(e.currentTarget.id);
        var post_id = e.currentTarget.id;
        wx.navigateTo({
            url: '../goods/goods?post_id='+post_id
        })
    }
});

