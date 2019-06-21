var Bmob = require('../../utils/bmob.js');
var app = getApp();
var img_arr = [];
var img_puts = [];
var messages = {};
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dealPlace: '',
        dealPrice: '',
        dealTime: '',
        goodsInfo: '',
        kindArray: ['服饰', '电子设备', '学习用具', '其它'],
        objectKindArray: [
            {
                id: 0,
                name: '服饰'
            },
            {
                id: 1,
                name: '电子设备'
            },
            {
                id: 2,
                name: '学习用品'
            },
            {
                id: 3,
                name: '其它'
            }
        ],
        index1: 0,
        levelArray: ['全新', '九成新', '九五新', '八成新', '八五新', '七成新', '七五新', '六成新', '六五新', '五成新', '五成新以下'],
        objectKindArray: [
            {
                id: 0,
                name: '全新'
            },
            {
                id: 1,
                name: '九五新'
            },
            {
                id: 2,
                name: '九成新'
            },
            {
                id: 3,
                name: '八五新'
            },
            {
                id: 4,
                name: '八成新'
            },
            {
                id: 5,
                name: '七五新'
            },
            {
                id: 6,
                name: '七成新'
            },
            {
                id: 7,
                name: '六五新'
            },
            {
                id: 8,
                name: '六成新'
            },
            {
                id: 9,
                name: '五五新'
            },
            {
                id: 10,
                name: '五成新'
            },
            {
                id: 11,
                name: '五成新以下'
            },
        ],
        index2: 0,
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 更改上传图片
     */
    to_change: function () {
        var that = this;
        wx.chooseImage({
            count: 6, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
                var tempFilePaths = res.tempFilePaths;
                    var name = 'goods.jpg';//上传的图片的别名，建议可以用日期命名
                    var file = new Bmob.File(name, tempFilePaths);
                    file.save().then(function (res) {
                        var imgSrc = {};
                        imgSrc.imgs = res.url();
                        img_puts.push(res.url());
                        img_arr.push(imgSrc);
                        console.log(res.url() + "图片上传成功"+JSON.stringify(img_arr));
                        that.setData({
                            addimg: img_arr
                        });
                        app.globalData.i++;
                        if (app.globalData.i >= 6) {
                            app.globalData.i = 0;
                            that.setData({
                                over: "put_img"
                            })
                        };
                        
                    }, function (error) {
                        console.log(error);
                    })
            }
        })
    },

    /**
     * 更改服饰类别
     */
    bindKindChange: function (e) {
        // var that = this;
        console.log('picker发送选择改变，携带值为', e.detail.value);
        if (e.detail.value == 0) {
            messages.kind = "服饰";
        }

        if (e.detail.value == 1) {
            messages.kind = "电子产品";
        }

        if (e.detail.value == 2) {
            messages.kind = "学习用品";
        }

        if (e.detail.value == 3) {
            messages.kind = "其他";
        }


        this.setData({
            index1: e.detail.value
        })
    },

    /**
     * 更改服饰新旧程度
     */
    bindLevelChange: function (e) {
        // var that = this;
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (e.detail.value == 0) {
            messages.isNew = "全新";
        }
        if (e.detail.value == 1) {
            messages.isNew = "九成新";
        }
        if (e.detail.value == 2) {
            messages.isNew = "九五新";
        }
        if (e.detail.value == 3) {
            messages.isNew = "八成新";
        }
        if (e.detail.value == 4) {
            messages.isNew = "八五新";
        }
        if (e.detail.value == 5) {
            messages.isNew = "七成新";
        }
        if (e.detail.value == 6) {
            messages.isNew = "七五新";
        }
        if (e.detail.value == 7) {
            messages.isNew = "六成新";
        }
        if (e.detail.value == 8) {
            messages.isNew = "六五新";
        }
        if (e.detail.value == 9) {
            messages.isNew = "五成新";
        }
        if (e.detail.value == 10) {
            messages.isNew = "五成以下";
        }

        this.setData({
            index2: e.detail.value
        })
    },

    /**
     * 更改dealPlace（描述宝贝）数据
     */
    to_dealPlace(e) {
        messages.place = e.detail.value;
        this.setData({
            dealPlace: e.detail.value
        })
    },

    /**
     * 更改dealPrice（价格）数据
     */
    to_dealPrice(e) {
        messages.price = e.detail.value;
        this.setData({
            dealPrice: e.detail.value
        })
    },

    /**
     * 更改dealTime（交易时间）数据
     */
    to_dealTime(e) {
        messages.time = e.detail.value;
        this.setData({
            dealTime: e.detail.value
        })
    },

    /**
     * 更改goodsInfo（描述宝贝）数据
     */
    to_goodsInfo(e) {
        messages.describ = e.detail.value;
        this.setData({
            goodsInfo: e.detail.value
        })
    },

    /**
     * 点击发布，提交函数触发
     */
    post_message: function (e) {
        if (!img_arr) {
            wx.showModal({
                title: '提示',
                content: '请添加图片',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (!messages.kind) {
            wx.showModal({
                title: '提示',
                content: '请选择商品类别',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (!messages.isNew) {
            wx.showModal({
                title: '提示',
                content: '请选择新旧程度',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (!messages.place) {
            wx.showModal({
                title: '提示',
                content: '请输入交易地点',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (!messages.price) {
            wx.showModal({
                title: '提示',
                content: '请输入商品价格',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (isNaN(messages.price)){
            wx.showModal({
                title: '提示',
                content: '商品价格请输入阿拉伯数字',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (!messages.time) {
            wx.showModal({
                title: '提示',
                content: '请输入交易时间',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        if (!messages.describ) {
            wx.showModal({
                title: '提示',
                content: '请输入商品描述',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        var Goods = Bmob.Object.extend("Goods");
        var goods = new Goods();
        goods.set("sellerName", app.globalData.userInfo.nickName);
        goods.set("openId", app.globalData.openid);
        goods.set("avatarUrl", app.globalData.userInfo.avatarUrl);
        goods.set("school", app.globalData.userSchool);
        goods.set("place", messages.place);
        goods.set("price", parseInt(messages.price));
        goods.set("kind", messages.kind);
        goods.set("time", messages.time);
        goods.set("isNew", messages.isNew);
        goods.set("miaoSu", messages.describ);
        goods.set("goodsImg0", img_puts[0]);
        goods.set("goodsImg1", img_puts[1]);
        goods.set("goodsImg2", img_puts[2]);
        goods.set("goodsImg3", img_puts[3]);
        goods.set("goodsImg4", img_puts[4]);
        goods.set("goodsImg5", img_puts[5]);
        //添加数据，第一个入口参数是null
        console.log("运行了")
        goods.save(null, {
            success: function (result) {
                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据          
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        img_puts=[];
                        img_arr=[];
                        setTimeout(function () {
                            wx.switchTab({
                                url: '../girl/girl',
                            })
                        }, 2000)
                    }
                });
                console.log("日记创建成功, objectId:" + result.id);
            },
            error: function (result, error) {
                // 添加失败
                console.log(JSON.stringify(error) + '创建日记失败');

            }
        });
    }
})