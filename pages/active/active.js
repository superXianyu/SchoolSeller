// pages/active/active.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
var moodImg_arr = [];
var moodImg_puts = [];
var messages = {};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addMoodImg: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 修改shareContent
     */
    to_shareContent: function (e) {
        messages.content = e.detail.value
        this.setData({
            shareContent: e.detail.value
        })

    },

    /**
     * 更改上传图片
     */
    to_change: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
                var tempFilePaths = res.tempFilePaths;
                var name = 'moods.jpg';//上传的图片的别名，建议可以用日期命名
                var file = new Bmob.File(name, tempFilePaths);
                file.save().then(function (res) {
                    var imgSrc = {};
                    imgSrc.imgs = res.url();
                    moodImg_puts.push(res.url());
                    moodImg_arr.push(imgSrc);
                    console.log(res.url() + "图片上传成功" + JSON.stringify(moodImg_arr));
                    that.setData({
                        addMoodImg: moodImg_puts,
                    });
                    app.globalData.i++;
                    if (app.globalData.i >= 9) {
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
     * 触发预览图片方法
     */
    to_preview: function (e) {
        var that = this;
        //获取当前图片的下标
        var imgIndex = e.target.id;
        var current = e.target.dataset.src;
        console.log(imgIndex);
        if (imgIndex != null) {
            wx.previewImage({
                urls: that.data.addMoodImg,
                current: current,
            })
        }
    },
  

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        moodImg_puts = [];
    },
    /**
     * 点击发布，提交函数触发
     */
    post_message: function (e) {
        var that = this;
        if (!messages.content) {
            wx.showModal({
                title: '提示',
                content: '请输入你的心情描述',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
        var Moods = Bmob.Object.extend("Moods");
        var moods = new Moods();
        moods.set("sellerName", app.globalData.userInfo.nickName);
        moods.set("openId", app.globalData.openid);
        moods.set("avatarUrl", app.globalData.userInfo.avatarUrl);
        moods.set("school", app.globalData.userSchool)
        moods.set("title", messages.title);
        moods.set("content", messages.content);
        moods.set("likeNum", 0);
        moods.addUnique("moodImg", moodImg_puts[0]);
        moods.addUnique("moodImg", moodImg_puts[1]);
        moods.addUnique("moodImg", moodImg_puts[2]);
        moods.addUnique("moodImg", moodImg_puts[3]);
        moods.addUnique("moodImg", moodImg_puts[4]);
        moods.addUnique("moodImg", moodImg_puts[5]);
        moods.addUnique("moodImg", moodImg_puts[6]);
        moods.addUnique("moodImg", moodImg_puts[7]);
        moods.addUnique("moodImg", moodImg_puts[8]);
        //添加数据，第一个入口参数是null
        console.log("运行了")
        moods.save(null, {
            success: function (result) {
                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据          
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        app.globalData.i = 0;
                        moodImg_arr=[];
                        moodImg_puts=[];
                        setTimeout(function () {
                            wx.switchTab({
                                url: '../dynamic/dynamic'
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
        that.setData({
            "addMoodImg": []
        })
    }

})