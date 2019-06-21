// pages/girl/girl.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
var goodsArr = [];
var searchArr = [];
var word = null;
var cloLen = 0;
var eleLen = 0;
var stuLen = 0;
var othLen = 0;
var choose_page = 0;
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
        is_show0: 'none',
        is_show1: 'none',
        is_show2: 'none',
        is_show3: 'none',
        others: 'bar4_1',
        goodsNull: true,
        loadingText: "加载更多",
    },

    /**
     * 监听页面加载函数
     */
    onLoad: function () {
        app.globalData.goodsKind = "服饰";
        var Users = Bmob.Object.extend("Users");
        var users = new Bmob.Query(Users);
        app.globalData.isLoad = true;
        var count = 0;
        var that = this;
        if(!app.globalData.openid){
            wx.showModal({
                title: '提示',
                content: '为了不影响您的使用，请您同意我们获取用户信息,否则我们只能显示默认学校的商品（吉林建筑大学）,取消后点击加载更多',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定' + app.globalData.id);
                        wx.navigateTo({
                            url: '../index/index',
                        })
                    }else if(res.cancel){
                        app.globalData.userSchool = "吉林建筑大学";
                        app.globalData.goodsKind = "服饰";
                        console.log("不统一");
                        if (app.globalData.isLoad) {
                            //   this.to_clothes();
                            switch (app.globalData.goodsKind) {
                                case "服饰": that.to_clothes; break;
                                case "电子设备": that.to_clothes; break;
                                case "学习用具": that.to_clothes; break;
                                case "其他": that.to_clothes;
                            }
                        }
                    }
                }
            });
        }
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
                        console.log("查询成功" + app.globalData.id);
                        if (object.get('school')) {
                            //查询到用户已经填写学校之后执行查询与用户学校相对应的商品
                            app.globalData.userSchool = object.get("school");
                        } else {
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
                            if (results.length != 0) {
                                for (var i = results.length - 1; goodsArr.length < 6 ,i>=0; i--) {
                                    console.log("ssssssssssssssssss"+i);
                                    var object = results[i];
                                    console.log("------"+JSON.stringify(object));
                                    var goodsObj = {};
                                    if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                        count++;
                                        goodsObj.goods_word = object.get("miaoSu");
                                        goodsObj.goods_price = object.get("price");
                                        goodsObj.post_id = object.id;
                                        goodsObj.imgs = object.get("goodsImg0");
                                        //    goodsObj.imgs = object.get("goodsImg0");
                                        goodsArr.push(goodsObj);
                                        // console.log(JSON.stringify(goodsArr));
                                    }
                                    cloLen = i;
                                }
                            }
                            if (cloLen == 0) {
                                that.setData({
                                    loadingText: "已无更多，快去发布吧"
                                })
                            }
                            if (goodsArr.length == 0) {
                                that.setData({
                                    "goods": goodsArr,
                                    loadingText:"你所在的学校，此类商品尚未有人发布",
                                    goodsNull: true
                                })
                            } else {
                                that.setData({
                                    "goods": goodsArr,
                                    goodsNUll: false
                                })
                            }
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
                                var User = Bmob.Object.extend("Uers");
                                //创建查询对象，入口参数是对象类的实例
                                var user = new Bmob.Query(User);
                                result.addUnique("myBuy", "[]");
                                var User = Bmob.Object.extend("Uers");
                                //创建查询对象，入口参数是对象类的实例
                                var user = new Bmob.Query(User);
                                result.addUnique("likeGoods", "[]");
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

    /**
     * 监听页面重载函数
     */
    onShow: function () {
        var that = this;
        if (!app.globalData.openid) {
            wx.showModal({
                title: '提示',
                content: '为了不影响您的使用，请您同意我们获取用户信息,否则我们只能显示默认学校的商品（吉林建筑大学）,若点击取消，则请点击页面中的加载更多，获取数据',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定' + app.globalData.id);
                        wx.navigateTo({
                            url: '../index/index',
                        })
                    } else if  (res.cancel) {
                        app.globalData.userSchool = "吉林建筑大学";
                        app.globalData.goodsKind = "服饰";
                        console.log("用户取消")
                        if (app.globalData.isLoad) {
                            //   this.to_clothes();
                            switch (app.globalData.goodsKind) {
                                case "服饰": that.to_clothes(); break;
                                case "电子设备": that.to_clothes(); break;
                                case "学习用具": that.to_clothes(); break;
                                case "其他": that.to_clothes();
                            }
                        }
                    }
                }
            })
        }
        if (app.globalData.isLoad) {
            //   this.to_clothes();
            switch (app.globalData.goodsKind) {
                case "服饰": that.to_clothes(); break;
                case "电子设备": that.to_clothes(); break;
                case "学习用具": that.to_clothes(); break;
                case "其他": that.to_clothes();
            }
        }
    },

    /**
     * 点击服饰框触发的的函数
     */
    to_clothes: function (e) {
        choose_page = 0;
        var that = this;
        console.log("用户的学校为：" + app.globalData.userSchool);
        goodsArr = [];
        var count = 1;
        app.globalData.goodsKind = "服饰";
        if (word) {
            console.log("搜索进行了" + JSON.stringify(searchArr));
            for (var i = 0; i < searchArr.length; i++) {
                if (searchArr[i].kind == "服饰") {
                    goodsArr.push(searchArr[i]);
                }
            }
            if (goodsArr == null) {
                that.setData({
                    "goods": goodsArr,
                    goodsNull: true,
                    "is_show0": "none"
                })
            } else {
                that.setData({
                    "goods": goodsArr,
                    goodsNUll: false,
                    "is_show0": "none"
                })
            }
        } else {
            var Goods = Bmob.Object.extend("Goods");
            var goodss = new Bmob.Query(Goods);
            // 查询所有数据
            goodss.find({
                success: function (results) {
                    goodsArr = [];
                    console.log("共查询到 " + results.length + " 条记录");
                    console.log(app.globalData.userSchool);
                    // 循环处理查询到的数据
                    for (var i = results.length - 1; i >= cloLen; i--) {
                        var object = results[i];
                        var goodsObj = {};
                        if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                            count++;
                            goodsObj.goods_word = object.get("miaoSu");
                            goodsObj.goods_price = object.get("price");
                            goodsObj.imgs = object.get("goodsImg0");
                            goodsObj.post_id = object.id;
                            goodsArr.push(goodsObj);
                            // console.log(JSON.stringify(goodsArr));
                        }
                    }
                    if (goodsArr.length == 0) {
                        that.setData({
                            goods: goodsArr,
                            goodsNull: true,
                            loadingText: "你所在的学校，此类商品尚未有人发布",
                            "is_show0": "none"
                        })
                    } else {
                        that.setData({
                            goods: goodsArr,
                            goodsNUll: false,
                            "is_show0": "none"
                        })
                    }
                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
        //判断数组中的元素是否有重复的
        var len = goodsArr.length;
        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
                if (goodsArr[i].post_id == goodsArr[j].post_id) {
                    goodsArr.splice(j, 1);
                    len--;
                    j--;
                }
            }
        }
        that.setData({
            goods: goodsArr,
            clothes: 'bar1_2',
            electron: 'bar2_1',
            study: 'bar3_1',
            others: 'bar4_1'
        })
    },

    /**
     * 点击电子设备框出发的函数
     */
    to_electron: function (e) {
        choose_page = 1;
        var that = this;
        goodsArr = [];
        var count = 1;
        app.globalData.goodsKind = "电子设备";
        if (word) {
            console.log("搜索进行了" + JSON.stringify(searchArr));
            for (var i = 0; i < searchArr.length; i++) {
                if (searchArr[i].kind == "电子设备") {
                    goodsArr.push(searchArr[i]);
                }
            }
            that.setData({
                "goods": goodsArr,
                "is_show1": "none"
            })
        } else {
            var Goods = Bmob.Object.extend("Goods");
            var goodss = new Bmob.Query(Goods);
            // 查询所有数据
            goodss.find({
                success: function (results) {
                    goodsArr = [];
                    console.log("共查询到 " + results.length + " 条记录");
                    console.log(app.globalData.userSchool);
                    // 循环处理查询到的数据
                    var len = 0;
                    if (eleLen == 0) {
                        for (var i = results.length - 1; (len < 6) && (i >= 0); i--) {
                            var object = results[i];
                            var goodsObj = {};
                            if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                count++;
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                len = goodsArr.length;
                                // console.log(JSON.stringify(goodsArr));
                            }
                            eleLen = i;
                        }
                    } else {
                        for (var i = results.length - 1; i >= eleLen; i--) {
                            var object = results[i];
                            var goodsObj = {};
                            if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                count++;
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                console.log(JSON.stringify(goodsArr));
                            }
                        }
                    }
                    if (goodsArr.length == 0) {
                        that.setData({
                            goods:goodsArr,
                            goodsNull: true,
                            loadingText: "你所在的学校，此类商品尚未有人发布",
                            "is_show1": "none"
                        })
                    } else {
                        that.setData({
                            goods: goodsArr,
                            goodsNUll: false,
                            "is_show1": "none"
                        })
                    }
                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
        // console.log("电子设备数组长度----" + that.data.goods.length);
        //判断数组中的元素是否有重复的
        var len = goodsArr.length;
        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
                if (goodsArr[i].post_id == goodsArr[j].post_id) {
                    goodsArr.splice(j, 1);
                    len--;
                    j--;
                }
            }
        }
        that.setData({
            goods: goodsArr,
            clothes: 'bar1_1',
            electron: 'bar2_2',
            study: 'bar3_1',
            others: 'bar4_1'
        })
    },

    /**
     * 点击学习用具框触发的函数
     */
    to_study: function (e) {
        choose_page = 2;
        var that = this;
        goodsArr = [];
        var count = 0;
        app.globalData.goodsKind = "学习用品";
        if (word) {
            console.log("搜索进行了" + JSON.stringify(searchArr));
            for (var i = 0; i < searchArr.length; i++) {
                if (searchArr[i].kind == "学习用品") {
                    goodsArr.push(searchArr[i]);
                }
            }
            that.setData({
                "goods": goodsArr,
                "is_show2": "none"
            })
        } else {
            var Goods = Bmob.Object.extend("Goods");
            var goodss = new Bmob.Query(Goods);
            // 查询所有数据
            goodss.find({
                success: function (results) {
                    goodsArr = [];
                    console.log("共查询到 " + results.length + " 条记录");
                    console.log(app.globalData.userSchool);
                    // 循环处理查询到的数据
                    var len = 0;
                    if (stuLen == 0) {
                        for (var i = results.length - 1; (len < 6) && (i >= 0); i--) {
                            var object = results[i];
                            var goodsObj = {};
                            if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                count++;
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                len = goodsArr.length;
                                console.log(JSON.stringify(goodsArr));
                            }
                            stuLen = i;
                        }
                    } else {
                        for (var i = results.length - 1; i >= stuLen; i--) {
                            var object = results[i];
                            var goodsObj = {};
                            if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                count++;
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                // console.log(JSON.stringify(goodsArr));
                            }
                        }
                    }
                    if (goodsArr.length == 0) {
                        that.setData({
                            goods: goodsArr,
                            goodsNull: true,
                            loadingText: "你所在的学校，此类商品尚未有人发布",
                            "is_show2": "none"
                        })
                    } else {
                        that.setData({
                            goods: goodsArr,
                            goodsNUll: false,
                            "is_show2": "none"
                        })
                    }
                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
        this.setData({
            clothes: 'bar1_1',
            electron: 'bar2_1',
            study: 'bar3_2',
            others: 'bar4_1'
        });
        console.log("学习用具数组长度1----" + that.data.goods.length);
        console.log("学习用具数组长度2" + goodsArr.length);
        console.log("学习用具比较====" + (that.data.goods == goodsArr));
        // var array3 = goodsArr;
        //判断数组中的元素是否有重复的
        var len = goodsArr.length;
        for (var i = 0; i < len; i++) {
              for (var j = i + 1; j < len; j++) {
                   if (goodsArr[i].post_id == goodsArr[j].post_id) {
                        goodsArr.splice(j, 1);
                        len--;
                        j--;
                   }
              }
         }
        that.setData({
            goods: goodsArr,
        })
    },

    /**
     * 点击其他框产触发的函数
     */
    to_others: function (e) {
        choose_page = 3;
        app.globalData.goodsKind = "其他";
        var that = this;
        goodsArr = [];
        var count = 1;
        if (word) {
            console.log("搜索进行了" + JSON.stringify(searchArr));
            for (var i = 0; i < searchArr.length; i++) {
                if (searchArr[i].kind == "其他") {
                    goodsArr.push(searchArr[i]);
                }
            }
            that.setData({
                "goods": goodsArr,
                "is_show3": "none"
            })
        } else {
            var Goods = Bmob.Object.extend("Goods");
            var goodss = new Bmob.Query(Goods);
            // 查询所有数据
            goodss.find({
                success: function (results) {
                    goodsArr = [];
                    console.log("共查询到 " + results.length + " 条记录");
                    console.log(app.globalData.userSchool);
                    // 循环处理查询到的数据
                    var len = 0;
                    if (othLen == 0) {
                        for (var i = results.length - 1; (len < 6) && (i >= 0); i--) {
                            var object = results[i];
                            var goodsObj = {};
                            if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                count++;
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                len = goodsArr.length;
                                // console.log(JSON.stringify(goodsArr));
                            }
                            othLen = i;
                        }
                    } else {
                        for (var i = results.length - 1; i >= othLen; i--) {
                            var object = results[i];
                            var goodsObj = {};
                            if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                                count++;
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                // console.log(JSON.stringify(goodsArr));
                            }
                        }
                    }
                    if (goodsArr.length == 0) {
                        that.setData({
                            goods: goodsArr,
                            loadingText: "你所在的学校，此类商品尚未有人发布",
                            goodsNull: true,
                            "is_show3": "none"
                        })
                    } else {
                        that.setData({
                            goods: goodsArr,
                            goodsNUll: false,
                            "is_show3": "none"
                        })
                    }
                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
        //判断数组中的元素是否有重复的
        var len = goodsArr.length;
        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
                if (goodsArr[i].post_id == goodsArr[j].post_id) {
                    goodsArr.splice(j, 1);
                    len--;
                    j--;
                }
            }
        }
        this.setData({
            goods: goodsArr,
            clothes: 'bar1_1',
            electron: 'bar2_1',
            study: 'bar3_1',
            others: 'bar4_2'
        });
    },

    /**
     * 获取搜索框中的搜索词
     */
    get_word: function (e) {
        word = e.detail.value;
        console.log(word);
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
     * 触发搜索行为
     */
    search: function () {
        goodsArr = [];
        var that = this;
        var sure = new RegExp('.*' + word + '.*', 'g');
        var Goods = Bmob.Object.extend("Goods");
        var goods = new Bmob.Query(Goods);
        var show = [false, false, false, false];
        var count = 0;
        // 查询所有数据
        this.setData({
            goods:[]
        })
        goods.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var miaoSu = sure.exec(object.get("miaoSu"));
                    var seller_name = sure.exec(object.get("sellerName"));
                    var time = sure.exec(object.get("time"));
                    var place = sure.exec(object.get("palce"));
                    var is_new = sure.exec(object.get("isNew"));
                    var price = sure.exec(object.get("price"));
                    if ((miaoSu || seller_name || time || place || is_new || price) && app.globalData.userSchool == object.get("school")) {
                        var goodsObj = {};
                        goodsObj.goods_word = object.get("miaoSu");
                        goodsObj.goods_price = object.get("price");
                        goodsObj.imgs = object.get("goodsImg0");
                        goodsObj.kind = object.get("kind");
                        goodsObj.post_id = object.id;
                        searchArr.push(goodsObj);
                        if (object.get("kind") == "服饰") {
                            show[0] = true;
                            console.log(show[0]);
                        }
                        if (object.get("kind") == "电子设备") {
                            show[1] = true;
                        }
                        if (object.get("kind") == "学习用品") {
                            show[2] = true;
                        }
                        if (object.get("kind") == "其他") {
                            show[3] = true;
                        }
                        console.log("存在该货品" + choose_page);
                        if (choose_page == 0) {
                            if (object.get("kind") == "服饰") {
                                var goodsObj = {};
                                goodsObj.goods_word = object.get("miaoSu");
                                goodsObj.goods_price = object.get("price");
                                goodsObj.imgs = object.get("goodsImg0");
                                goodsObj.post_id = object.id;
                                goodsArr.push(goodsObj);
                                count++;
                            }
                        } else {
                            if (choose_page == 1) {
                                if (object.get("kind") == "电子设备") {
                                    var goodsObj = {};
                                    goodsObj.goods_word = object.get("miaoSu");
                                    goodsObj.goods_price = object.get("price");
                                    goodsObj.imgs = object.get("goodsImg0");
                                    goodsObj.post_id = object.id;
                                    goodsArr.push(goodsObj);
                                    count++;
                                }
                            } else {
                                if (choose_page == 2) {
                                    if (object.get("kind") == "学习用品") {
                                        var goodsObj = {};
                                        goodsObj.goods_word = object.get("miaoSu");
                                        goodsObj.goods_price = object.get("price");
                                        goodsObj.imgs = object.get("goodsImg0");
                                        goodsObj.post_id = object.id;
                                        goodsArr.push(goodsObj);
                                        count++;
                                    }
                                } else {
                                    if (choose_page == 3) {
                                        if (object.get("kind") == "其他") {
                                            var goodsObj = {};
                                            goodsObj.goods_word = object.get("miaoSu");
                                            goodsObj.goods_price = object.get("price");
                                            goodsObj.imgs = object.get("goodsImg0");
                                            goodsObj.post_id = object.id;
                                            goodsArr.push(goodsObj);
                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    console.log(object.id + ' - ' + object.get('title'));
                }
                if (show[0] && (choose_page != 0)) {
                    that.setData({
                        is_show0: "block"
                    })
                }
                if (show[1] && choose_page != 1) {
                    that.setData({
                        is_show1: "block"
                    })
                }
                if (show[2] && choose_page != 2) {
                    that.setData({
                        is_show2: "block"
                    })
                }
                if (show[3] && choose_page != 3) {
                    that.setData({
                        is_show3: "block"
                    })
                }
                var len = goodsArr.length;
                for (var i = 0; i < len; i++) {
                    for (var j = i + 1; j < len; j++) {
                        if (goodsArr[i].post_id == goodsArr[j].post_id) {
                            goodsArr.splice(j, 1);
                            len--;
                            j--;
                        }
                    }
                }
                that.setData({
                    "goods": goodsArr
                })
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
    },

    /**
     * 监听页面隐藏函数
     */
    onHide: function () {
        this.setData({
            search_value: "",
            is_show0: 'none',
            is_show1: 'none',
            is_show2: 'none',
            is_show3: 'none'
        })
        goodsArr = [];
        word = "";
    },

    /**
     * 点击进入商品详情页
     */
    to_goods: function (e) {
        console.log(e.currentTarget.id);
        var post_id = e.currentTarget.id;
        wx.navigateTo({
            url: '../goods/goods?post_id=' + post_id
        })
    },

    /**
     * 点击加载更多
     */
    toLoading: function (e) {
        var that = this;
        var array1 = that.data.goods;
        var kindLen;
        var kindShow;
        that.setData({
            loadingText: "正在加载",
        })
        wx.showLoading({
            title: '加载中，请稍后',
        })
        setTimeout(function () {
            wx.showLoading({
                title: '加载完成',
            })
            wx.hideLoading();
            if(!word){
                switch (app.globalData.goodsKind) {
                    case "服饰": cloLen = that.loadingMore(cloLen); kindShow = that.data.is_show0; break;
                    case "电子设备": eleLen = that.loadingMore(eleLen); kindShow = that.data.is_show1; break;
                    case "学习用具": stuLen = that.loadingMore(stuLen); kindShow = that.data.is_show2; break;
                    case "其他": othLen = that.loadingMore(othLen); kindShow = that.data.is_show3; break;
                }
            }else{
                switch (app.globalData.goodsKind) {
                    case "服饰": that.to_clothes(); kindShow = that.data.is_show0; break;
                    case "电子设备": that.to_electron(); kindShow = that.data.is_show1; break;
                    case "学习用具": that.to_study(); kindShow = that.data.is_show2; break;
                    case "其他": that.to_others(); kindShow = that.data.is_show3; break;
                }
            }
            
        }, 1500);

    },
    loadingMore: function (kindLen) {
        console.log("----测试2-----" + kindLen);
        var that = this;
        var array1 = [];
        var count = 0;
        var len = 0;
        var Goods = Bmob.Object.extend("Goods");
        var goodss = new Bmob.Query(Goods);
        // 查询所有数据
        goodss.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                console.log(app.globalData.userSchool);
                // 循环处理查询到的数据
                console.log(len + "   " + goodsArr.length + "" + results.length);
                results = results.reverse();
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var goodsObj = {};
                    if (object.get("school") == app.globalData.userSchool && object.get("kind") == app.globalData.goodsKind) {
                        count++;
                        if (count > goodsArr.length) {
                            goodsObj.goods_word = object.get("miaoSu");
                            goodsObj.goods_price = object.get("price");
                            goodsObj.imgs = object.get("goodsImg0");
                            goodsObj.post_id = object.id;
                            array1.push(goodsObj);
                            len++;
                            if (len == 6) {
                                break;
                            }
                        }
                        console.log(JSON.stringify(array1));
                    }
                    kindLen = array1.length;
                }
                for (var i = 0; i < array1.length; i++) {
                    goodsArr.push(array1[i]);
                }
                console.log("物品共有" + array1.length + "件" + kindLen);
                if (kindLen == 0) {
                    that.setData({
                        "loadingText": "加载完成",
                    })
                } else {
                    that.setData({
                        "loadingText": "加载更多",
                    })
                }
                if (!goodsArr) {
                    that.setData({
                        "goods": goodsArr,
                        goodsNull: true,
                    })
                } else {
                    that.setData({
                        "goods": goodsArr,
                        goodsNUll: false,
                    })
                }
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        console.log("----测试2-----" + kindLen);
        return kindLen;
    },
    //上拉刷新
    onReachBottom: function () {
        var that = this
        this.setData({
            loadingText: "正在加载",
        })
        wx.showLoading({
            title: '加载中，请稍后',
            success:function(){
                setTimeout(function () {
                    wx.showToast({
                        title: '获取成功！',
                        icon: 'success',
                        duration: 2000,
                        success: function () {

                        }
                    });
                }, 2000)
                
            }
        })
        
        setTimeout(function () {
            wx.showLoading({
                title: '加载完成',
            })
            wx.hideLoading();
            that.loadingMore();
        }, 1500);
    }
});



