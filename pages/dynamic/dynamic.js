var app = getApp();
var Bmob = require('../../utils/bmob.js');
var likeObj = [];
var len = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        likeImg: '../../icon/love.png',
        moodsList: [],
        loadingText: "加载更多",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
            var that = this;
            wx.showLoading({
                title: '加载中',
            })
            if (that.data.loadingText == "已无更多") {
                wx.hideLoading();
                wx.showToast({
                    title: '已无更多',
                })
            } else {
                setTimeout(function () {
                    wx.hideLoading()
                    wx.showToast({
                        title: '加载完成',
                    })
                }, 1000)
            }
            var moodsArr = [];
            var len1 = 0;
            // that.getDateDiff();
            var Moods = Bmob.Object.extend("Moods");
            var moods = new Bmob.Query(Moods);
            // 查询所有数据
            moods.find({
                success: function (results) {
                    console.log("共查询到 " + results.length + " 条记录");
                    // 循环处理查询到的数据
                    for (var i = results.length - 1; len1 < 8; i--) {
                        var object = results[i];
                        var moodsObj = {};
                        console.log(object.id + ' - ' + object.get('title'));
                        moodsObj.touxiang = object.get('avatarUrl');
                        moodsObj.moodsId = object.id;
                        moodsObj.openId = object.get("openId");
                        moodsObj.nickName = object.get('sellerName');
                        moodsObj.shareContent = object.get('content');
                        // moodsObj.shareTime = that.getDateDiff(object.createdAt);
                        moodsObj.shareTime = object.createdAt;
                        moodsObj.school = object.get('school');
                        moodsObj.shareImg = object.get('moodImg');
                        if (moodsObj.shareImg == null) {
                            moodsObj.imgSize = "imgs0";
                        } else if (moodsObj.shareImg.length == 1) {
                            moodsObj.imgSize = "imgs1";
                        } else if (moodsObj.shareImg.length == 2) {
                            moodsObj.imgSize = "imgs2";
                        } else {
                            moodsObj.imgSize = "imgs";
                        }
                        likeObj = object.get('likeObj');
                        if (likeObj == null) {
                            moodsObj.likeImg = '../../icon/love.png';
                            moodsObj.likeNum = "";
                        } else {
                            console.log("likeObj数组长度为" + likeObj.length);
                            moodsObj.likeNum = likeObj.length;
                            for (var j = 0; j < likeObj.length; j++) {
                                if (likeObj[j] == app.globalData.openid) {
                                    moodsObj.likeImg = '../../icon/loved.png';
                                    break;
                                }
                                moodsObj.likeImg = '../../icon/love.png';
                            }
                            moodsObj.likeNum == 0;
                        }
                        console.log("元素" + i + "装载成功");
                        moodsArr.push(moodsObj);
                        len1 = moodsArr.length;
                        len = i;
                        if (len == 0) {
                            that.setData({
                                "loadingText": "已无更多",
                            })
                        }
                    }
                    console.log("元素全部装载成功");
                    that.setData({
                        "moodsList": moodsArr
                    })
                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            })
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
        if (app.globalData.openid) {
            var that = this;
            var moodsArr = [];
            var Moods = Bmob.Object.extend("Moods");
            var moods = new Bmob.Query(Moods);
            // 查询所有数据
            moods.find({
                success: function (results) {
                    console.log("共查询到 " + results.length + " 条记录");
                    // 循环处理查询到的数据
                    for (var i = results.length - 1; i > len; i--) {
                        var object = results[i];
                        var moodsObj = {};
                        console.log(object.id + ' - ' + object.get('title'));
                        moodsObj.touxiang = object.get('avatarUrl');
                        moodsObj.moodsId = object.id;
                        moodsObj.openId = object.get("openId");
                        moodsObj.nickName = object.get('sellerName');
                        moodsObj.shareContent = object.get('content');
                        // moodsObj.shareTime = that.getDateDiff(object.createdAt);
                        moodsObj.shareTime = object.createdAt;
                        moodsObj.school = object.get('school');
                        // moodsObj.shareImg = [];
                        moodsObj.shareImg = object.get('moodImg');
                        // console.log("object.get('moodImg')测试----" + moodsObj.shareImg.length)
                        if (moodsObj.shareImg == null) {
                            moodsObj.imgSize = "imgs0";
                        } else if (moodsObj.shareImg.length == 1) {
                            moodsObj.imgSize = "imgs1";
                        } else if (moodsObj.shareImg.length == 2) {
                            moodsObj.imgSize = "imgs2";
                        } else {
                            moodsObj.imgSize = "imgs";
                        }
                        likeObj = object.get('likeObj');
                        if (likeObj == null || likeObj.length == 0) {
                            moodsObj.likeImg = '../../icon/love.png';
                            moodsObj.likeNum = "";
                        } else {
                            console.log("likeObj数组长度为" + likeObj.length);
                            moodsObj.likeNum = likeObj.length;
                            for (var j = 0; j < likeObj.length; j++) {
                                if (likeObj[j] == app.globalData.openid) {
                                    moodsObj.likeImg = '../../icon/loved.png';
                                    break;
                                }
                                moodsObj.likeImg = '../../icon/love.png';
                            }
                        }
                        console.log(moodsObj.likeNum);
                        console.log("元素" + i + "装载成功");
                        moodsArr.push(moodsObj);
                    }
                    console.log("元素全部装载成功");
                    if (len == 0) {
                        that.setData({
                            "moodsList": moodsArr,
                            "loadingText": "已无更多",
                        })
                    } else {
                        that.setData({
                            "moodsList": moodsArr,
                            "loadingText": "加载更多",
                        })
                    }
                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
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
        var that = this;
        that.onShow();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this;
        that.to_loading();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var objId = e.currentTarget.id;
        return {
            title: '自定义转发标题',
            path: '../comments/comments?id=' + objId,
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
     * 触发细节查看评论页面
     */
    to_comment: function (e) {
        console.log(e.currentTarget.id);
        console.log(e);
        var objId = e.currentTarget.id;
        wx.navigateTo({
            url: '../comments/comments?id=' + objId
        })
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
            console.log(that.data.moodsList[objId].shareImg);
            wx.previewImage({
                urls: that.data.moodsList[objId].shareImg,
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
        var objIndex = e.target.id;
        var Moods = Bmob.Object.extend("Moods");
        var moods = new Bmob.Query(Moods);
        moods.get(objId, {
            success: function (result) {
                likeObj = result.get('likeObj');
                if (likeObj == null) {
                    var num = 0;
                } else {
                    var num = likeObj.length;
                }
                result.addUnique("likeObj", app.globalData.openid);
                result.save();
                likeObj = result.get('likeObj');
                var num1 = likeObj.length;
                var indexNum = "moodsList[" + objIndex + "].likeNum";
                var indexImg = "moodsList[" + objIndex + "].likeImg";
                if (num < num1) {
                    that.setData({
                        [indexNum]: num1,
                        [indexImg]: '../../icon/loved.png',
                    })
                } else {
                    result.remove("likeObj", app.globalData.openid);
                    result.save();
                    if (num1 == 1) {
                        that.setData({
                            [indexNum]: "",
                            [indexImg]: '../../icon/love.png',
                        })
                    } else {
                        that.setData({
                            [indexNum]: num1 - 1,
                            [indexImg]: '../../icon/love.png',
                        })
                    }
                }
                console.log(num);
                console.log(that.data.moodsList[objIndex].likeNum);
            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
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
     * 增加点击加载更多
     */
    to_loading(e) {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        setTimeout(function () {
            wx.hideLoading()
            wx.showToast({
                title: '加载完成',
            })
        }, 1000)
        console.log("已加载的数组长度为：" + that.data.moodsList.length)
        console.log("len-----" + len);
        that.setData({
            loadingText: "正在加载",
        })
        var array1 = this.data.moodsList;
        var array2 = [];
        var len2 = 0;
        var disLikeMoods = [];
        var disLikeUsers = [];
        var Users = Bmob.Object.extend("Users");
        var user = new Bmob.Query(Users);
        //获取个人用户的disLikeMoods和Obj进行筛选
        user.get(app.globalData.id, {
            success: function (res) {
                disLikeMoods = res.get("disLikeMoods");
                disLikeUsers = res.get("disLikeObj");
            },
            error: function (object, error) {
                console.log("失败");
            }
        })
        var Moods = Bmob.Object.extend("Moods");
        var moods = new Bmob.Query(Moods);
        // 查询所有数据
        moods.find({
            success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                // 循环处理查询到的数据
                console.log(len);
                //从len - 1开始循环加载
                for (var i = len - 1; len2 < 5; i--) {
                    if (len == 0) {     //判断数据是否全部加载完成
                        that.setData({
                            "loadingText": "已无更多",
                        })
                        break;
                    }
                    var object = results[i];
                    var moodsObj = {};
                    console.log(object.id + ' - ' + object.get('title'));
                    moodsObj.touxiang = object.get('avatarUrl');
                    moodsObj.moodsId = object.id;
                    moodsObj.openId = object.get("openId");
                    moodsObj.nickName = object.get('sellerName');
                    moodsObj.shareContent = object.get('content');
                    // moodsObj.shareTime = that.getDateDiff(object.createdAt);
                    moodsObj.shareTime = object.createdAt;
                    moodsObj.school = object.get('school');
                    // moodsObj.shareImg = [];
                    moodsObj.shareImg = object.get('moodImg');
                    // console.log("object.get('moodImg')测试----" + moodsObj.shareImg.length)
                    if (moodsObj.shareImg == null) {
                        moodsObj.imgSize = "imgs0";
                    } else if (moodsObj.shareImg.length == 1) {
                        moodsObj.imgSize = "imgs1";
                    } else if (moodsObj.shareImg.length == 2) {
                        moodsObj.imgSize = "imgs2";
                    } else {
                        moodsObj.imgSize = "imgs";
                    }
                    likeObj = object.get('likeObj');
                    if (likeObj == null || likeObj.length == 0) {
                        moodsObj.likeImg = '../../icon/love.png';
                        moodsObj.likeNum = "";
                    } else {
                        console.log("likeObj数组长度为" + likeObj.length);
                        moodsObj.likeNum = likeObj.length;
                        for (var j = 0; j < likeObj.length; j++) {
                            if (likeObj[j] == app.globalData.openid) {
                                moodsObj.likeImg = '../../icon/loved.png';
                                break;
                            }
                            moodsObj.likeImg = '../../icon/love.png';
                        }
                    }
                    console.log(moodsObj.likeNum);
                    console.log("元素" + i + "装载成功");
                    array2.push(moodsObj);
                    len = i;
                    console.log("len--" + len);
                    len2 = array2.length;
                    console.log("len2--" + len2);


                }
                console.log("元素全部装载成功");
                // array2.reverse();
                array1 = array1.concat(array2);
                if (that.data.loadingText == "已无更多") {
                    that.setData({
                        "moodsList": array1,
                        "loadingText": "已无更多"
                    })
                } else {
                    that.setData({
                        "moodsList": array1,
                        "loadingText": "加载更多"
                    })
                }
            },
        })
    },

    /**
     * 细节详情
     */
    to_details: function (e) {
        console.log("details----" + e.currentTarget.id);
        console.log(e);
        var objId = e.currentTarget.id;
        wx.navigateTo({
            url: '../comments/comments?id=' + objId
        })
    },

    /**
     * 删除动态
     */
    to_delete: function (e) {
        console.log(e);
        var that = this;
        var objId = e.currentTarget.id;
        var userOpenId = e.currentTarget.dataset.objid;
        var index = e.currentTarget.dataset.index;
        var Moods = Bmob.Object.extend("Moods");
        var moods = new Bmob.Query(Moods);
        var Users = Bmob.Object.extend("Users");
        var user = new Bmob.Query(Users);
        var imgSrc = [];
        console.log("userOpenId测试" + userOpenId);
        console.log("app.globalData.openid测试" + app.globalData.openid);
        if (userOpenId == app.globalData.openid) {
            //当动态为自己所创建
            wx.showActionSheet({
                itemList: ["删除此动态"],
                success: function (res) {
                    wx.showModal({
                        title: '提示',
                        content: '确认删除该动态（不可撤回）',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                moods.get(objId, {
                                    success: function (res) {
                                        //获取该对象的图片地址数组
                                        imgSrc = res.get("moodImg");
                                        //删除mood对象
                                        res.destroy({
                                            success: function (myObject) {
                                                // 删除成功
                                                console.log("myObject删除结果成功" + myObject);
                                            },
                                            error: function (myObject, error) {
                                                // 删除失败
                                                console.log("删除失败");
                                            }
                                        });
                                        //删除图片地址
                                        for (var i = 0; i < imgSrc.length; i++) {
                                            var path;
                                            path = imgSrc[i];
                                            var s = new Bmob.Files.del(path).then(function (res) {
                                                if (res.msg == "ok") {
                                                    console.log('删除成功');
                                                }
                                            },
                                                function (error) {
                                                    console.log(error)
                                                });
                                        }
                                        //从moodsList中删除该moods
                                        var array1 = [];
                                        array1 = that.data.moodsList;
                                        array1 = array1.splice(index, 1);
                                        that.setData({
                                            "moodsList": array1,
                                        })
                                    },
                                    error: function (object, error) {
                                        console.log(error)
                                    }
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                },
                fail: function (res) {
                    console.log(res.errMsg)
                }
            })
        } else {
            //当该动态为他人所创建
            wx.showActionSheet({
                itemList: ["隐藏此动态", "隐藏此人的动态"],
                success: function (res) {
                    console.log(res.tapIndex)
                    switch (res.tapIndex) {
                        case 0:
                            wx.showModal({
                                title: '提示',
                                content: '不再接收此动态',
                                success: function (res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定');
                                        console.log("测试app.gloalData.userInfo.id----" + app.globalData.id);
                                        console.log("测试app.gloalData.userInfo.id----" + app.globalData.userInfo);
                                        user.get(app.globalData.id, {
                                            success: function (result) {
                                                result.addUnique("disLikeMoods", objId);
                                                result.save();
                                            },
                                            error: function (object, error) {
                                                // 查询失败
                                            }
                                        })
                                        //从moodsList中删除该moods
                                        var array1 = [];
                                        var array2 = [];
                                        array1 = that.data.moodsList;
                                        array2 = array1.splice(index, 1);
                                        that.setData({
                                            "moodsList": array2,
                                        })
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            }); break;
                        case 1:
                            wx.showModal({
                                title: '提示',
                                content: '不再接收此人的动态',
                                success: function (res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定');
                                        user.get(app.globalData.id, {
                                            success: function (result) {
                                                result.addUnique("disLikeObj", userOpenId);
                                                result.save();
                                            },
                                            error: function (object, error) {
                                                // 查询失败
                                            }
                                        })
                                        //从moodsList中删除与创建人创建的所有moods
                                        var array1 = [];
                                        var array2 = [];
                                        array1 = that.data.moodsList;
                                        for (var i = 0; i < array1.length; i++) {
                                            if (array1[i].openId == userOpenId) {
                                                array2 = array1.splice(i, 1);
                                            }
                                        }
                                        that.setData({
                                            "moodsList": array2,
                                        })
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            });
                    }
                },
                fail: function (res) {
                    console.log(res.errMsg)
                }
            })
        }
    },

    // /**
    //  * 筛选屏蔽的动态
    //  */
    // shieldMoods: function (moods, array) {
    //   var moodsReturn = [];
    //   var moodsArray = [];
    //   var testArray = [];
    //   moodsArray = moods;
    //   testArray = array;
    //   console.log("测试长度1"+moodsArray.length);
    //   for (var i = 0, j = 0; i < testArray.length; i++) {
    //     for (var k = 0; k < moodsArray.length; k++) {
    //       if (moodsArray[i] != testArray[j].moodsId) {
    //         moodsReturn[j] = testArray[i];
    //         j++;
    //       }
    //     }
    //   }
    //   return moodsReturn;
    // },

    // /**
    //  * 筛选屏蔽的用户
    //  */
    // shieldObjs: function (objs, array) {
    //   var objReturn = [];
    //   var objArray = [];
    //   var testArray =[];
    //   objArray = objs;
    //   testArray = array;
    //   console.log("测试长度1" + objArray.length);
    //   for (var i = 0, j = 0; i < testArray.length; i++) {
    //     for (var k = 0; k < objArray.length; k++) {
    //       if (objArray[i] != testArray[j].openId){
    //         objReturn[j] = testArray[i];
    //         j++;
    //       }
    //     }
    //   }
    //   return objReturn;
    // },

    /**
     * 定义时间函数
     */
    // getDateDiff: function (dateTimeStamp) {
    //   var result;
    //   var minute = 1000 * 60;
    //   var hour = minute * 60;
    //   var day = hour * 24;
    //   var halfamonth = day * 15;
    //   var month = day * 30;
    //   var now = new Date().getTime();
    //   var before = new Date(dateTimeStamp).getTime();
    //   console.log("now--" + now);
    //   console.log("dateTimeStamp--" + dateTimeStamp);
    //   console.log("before--" + before);
    //   var diffValue = now - before;//时间差的毫秒数
    //   console.log("diffValue--" + diffValue);
    //   //计算出相差天数  
    //   var days = Math.floor(diffValue / (24 * 3600 * 1000))
    //   //计算出小时数  
    //   var leave1 = diffValue % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数 
    //   var hours = Math.floor(leave1 / (3600 * 1000))
    //   //计算相差分钟数  
    //   var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
    //   var minutes = Math.floor(leave2 / (60 * 1000))
    //   //计算相差秒数  
    //   var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
    //   var seconds = Math.round(leave3 / 1000)
    //   if (days > 90) {
    //     result = dateTimeStamp;
    //   } else if (days > 30) {
    //     result = "一月前";
    //   } else if (days > 7) {
    //     result = "一周前";
    //   } else if (days > 3) {
    //     result = "三天前";
    //   } else if (days > 2) {
    //     result = "前天";
    //   } else if (days > 1) {
    //     result = "昨天";
    //   } else if (hours > 1) {
    //     result = hours + "小时前";
    //   } else if (minutes > 1) {
    //     result = minutes + "分前";
    //   } else {
    //     result = seconds + "秒前";
    //   }
    //   return result;
    // }

})