// pages/comments/comments.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
var messages = {};
var comArr = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        touxiang: '../../icon/touxiang.png',
        nickName: 'sellerName',
        school: 'sellerSchool',
        createDate: 'data',
        shareContent: 'sellerContent',
        moodImgs: ['../../icon/close.jpg', '../../icon/touxiang.png'],
        likeImg: '../../icon/love.png',
        comList: [{}],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        comArr = [];
        console.log(options);
        console.log(options.id);
        var objId = options.id;
        var Moods = Bmob.Object.extend("Moods");
        var moods = new Bmob.Query(Moods);
        moods.get(objId, {
            success: function (result) {
                var sellerImg = result.get("avatarUrl");
                var sellerName = result.get("sellerName");
                var sellerSchool = result.get("school");
                var sellerContent = result.get("content");
                var imgs = result.get("moodImg");
                var data = result.createdAt;
                var likeObj = result.get('likeObj');
                if (likeObj == null || likeObj.length == 0) {
                    that.setData({
                        likeImg: '../../icon/love.png',
                        likeNum: "",
                    })
                } else {
                    console.log("likeObj数组长度为" + likeObj.length);
                    for (var j = 0; j < likeObj.length; j++) {
                        if (likeObj[j] == app.globalData.openid) {
                            that.setData({
                                likeImg: '../../icon/loved.png',
                                likeNum: likeObj.length,
                            })
                            break;
                        }
                        that.setData({
                            likeImg: '../../icon/love.png',
                            likeNum: likeObj.length,
                        })
                    }
                }
                that.setData({
                    moodId: objId,
                    touxiang: sellerImg,
                    nickName: sellerName,
                    school: sellerSchool,
                    createDate: data,
                    shareContent: sellerContent,
                    moodImgs: imgs,
                })
            },
            error: function (error) {

            }
        });
        var Comment = Bmob.Object.extend("Comments");
        var comment = new Bmob.Query(Comment);
        comment.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    for (var i = 0; i < results.length; i++) {
                    var obj = results[i];
                    if (obj.get("shareId") == objId) {
                        var com = {};
                        com.nickName = obj.get("sellerName");
                        com.touxiang = obj.get("avatarUrl");
                        com.content = obj.get("content");
                        com.school = obj.get("school")
                        com.date = obj.createdAt;
                        comArr.push(com);
                    }
                }
                that.setData({
                    comList: comArr
                })
                }
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
        
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
        return {
            title: '自定义转发标题',
            path: '/pages/comments/comments?id=' + id,
            success: function (res) {
                var shareTickets = res.shareTickets;
                if (shareTickets.length == 0) {
                    return false;
                }
                wx.getShareInfo({
                    shareTicket: shareTickets[0],
                    success: function (res) {
                        var encryptedData = res.encryptedData;
                        var iv = res.iv;
                    }
                })
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    /**
     * 触发显示预览图片函数
     */
    to_showImg: function (e) {
        var that = this;
        console.log(e);
        var objId = e.currentTarget.id;
        var imgId = e.target.id;
        var current = e.target.dataset.src;
        console.log(current);
        if (current != null) {
            console.log(that.data.moodImgs);
            wx.previewImage({
                urls: that.data.moodImgs,
                current: current,
            })
        }
    },

    /**
     * 触发点赞方法函数
     */
    to_like: function (e) {
        var that = this;
        var objId = e.currentTarget.id;
        // var objIndex = e.target.id;
        var Moods = Bmob.Object.extend("Moods");
        var moods = new Bmob.Query(Moods);
        moods.get(objId, {
            success: function (result) {
                var likeObj = result.get('likeObj');
                if (likeObj == null) {
                    var num = 0;
                } else {
                    var num = likeObj.length;
                }
                result.addUnique("likeObj", app.globalData.openid);
                result.save();
                likeObj = result.get('likeObj');
                var num1 = likeObj.length;
                if (num < num1) {
                    that.setData({
                        "likeNum": num1,
                        "likeImg": '../../icon/loved.png',
                    })
                } else {
                    result.remove("likeObj", app.globalData.openid);
                    result.save();
                    if (num1 == 1) {
                        that.setData({
                            "likeNum": "",
                            "likeImg": '../../icon/love.png',
                        })
                    } else {
                        that.setData({
                            "likeNum": num1 - 1,
                            "likeImg": '../../icon/love.png',
                        })
                    }
                }
                console.log(num);
                // console.log(that.data.moodsList[objIndex].likeNum);
                console.log(that.data.likeNum);
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        })
    },

    /**
     * to_comment
     */
    change_comment: function (e) {
        messages.content = e.detail.value
    },

    /**
     * 触发转发分享该动态
     */
    to_forward: function (e) {
        console.log(e)
        wx.showActionSheet({
            itemList: ['转发咸鱼圈', '转发微信'],
            success: function (res) {
                console.log(res);
                if (res.tapIndex == 0) {
                    console.log(0)
                } else if (res.tapIndex == 1) {
                    onShareAppMessage();
                }
            }
        })
    },

    /**
     * 点击发表评论
     */
    post_message: function (e) {
        var that = this;
        if (!messages.content) {
            wx.showModal({
                title: '提示',
                content: '请发表你的观点',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        };
        var Comments = Bmob.Object.extend("Comments");
        var comments = new Comments();
        comments.set("sellerName", app.globalData.userInfo.nickName);
        comments.set("userId", app.globalData.id);
        comments.set("avatarUrl", app.globalData.userInfo.avatarUrl);
        comments.set("school", app.globalData.userSchool);
        comments.set("content", messages.content);
        comments.set("shareId", that.data.moodId);
        //添加数据，第一个入口参数是null
        comments.save(null, {
            success: function (result) {
                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据          
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        var com = {};
                        com.nickName = app.globalData.userInfo.nickName;
                        com.touxiang = app.globalData.userInfo.avatarUrl;
                        com.content = messages.content;
                        comArr.unshift(com);
                        that.setData({
                            "comList":comArr
                        })
                    }
                })
            },
            error: function (result, error) {
                // 添加失败
                console.log(JSON.stringify(error) + '创建日记失败');
            }
        })
    },
  
})