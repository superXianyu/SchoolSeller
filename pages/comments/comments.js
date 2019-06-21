// pages/comments/comments.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
var messages = {};
var comArr = [];
var len = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // touxiang: '../../icon/touxiang.png',
    // nickName: 'sellerName',
    // school: 'sellerSchool',
    // createDate: 'data',
    // shareContent: 'sellerContent',
    moodImgs: [],
    // likeImg: '../../icon/love.png',
    comList: [],
    loadingText: "加载更多",
    commentValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getDateDiff();
    len = 0;
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
        var data = that.getDateDiff(result.createdAt);
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
          "moodId": objId,
          "touxiang": sellerImg,
          "nickName": sellerName,
          "school": sellerSchool,
          "createDate": data,
          "shareContent": sellerContent,
          "moodImgs": imgs,
        })
      },
      error: function (error) {

      }
    });
    var Comment = Bmob.Object.extend("Comments");
    var comment = new Bmob.Query(Comment);
    var len1 = 0;
    comment.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = results.length - 1; len1 < 5; i--) {
          if (i < 0) {     //判断数据是否全部加载完成
            that.setData({
              "loadingText": "已无更多",
            })
            break;
          }
          var obj = results[i];
          if (obj.get("shareId") == objId) {
            console.log("Id----" + obj.get("shareId"));
            console.log("objId----" + objId);
            var com = {};
            com.nickName = obj.get("sellerName");
            com.touxiang = obj.get("avatarUrl");
            com.content = obj.get("content");
            com.school = obj.get("school")
            com.date = that.getDateDiff(obj.createdAt);
            comArr.push(com);
            len1 = comArr.length;
            console.log("已添加数组长度----" + len1)
          }
          len = i;
        }
        console.log("comArr数组长度为" + comArr.length);
        that.setData({
          "comList": comArr
        })
        console.log("comList数组长度为" + that.data.comList.length);
        if (that.data.comList.length == 0) {
          that.setData({
            "loadingText": "暂时还未有评论，快来占领沙发",
          })
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    console.log("comList数组长度为-----" + that.data.comList.length);
    if (that.data.comList.length == 0) {
      that.setData({
        "loadingText": "暂时还未有评论，快来占领沙发",
      })
    }
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
    var that = this;
    that.to_loading();
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
  to_comment: function (e) {
    var that = this;
    that.setData({
      IO:true,
    })
  },

  /**
   * change_comment
   */
  change_comment: function (e) {
    var that = this;
    messages.content = e.detail.value;
    that.setData({
      "commentValue": e.detail.value
    })
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
              "comList": comArr,
              "loadingText": "已无更多"
            })
          }
        })
      },
      error: function (result, error) {
        // 添加失败
        console.log(JSON.stringify(error) + '创建日记失败');
      }
    })
    if (that.loadingTest == "暂时还未有评论，快来占领沙发") {
      that.setData({
        commentValue: "",
        loadingText:"已无更多"
      })
    } else {
      that.setData({
        commentValue: "",
      })
    }
  },

  /**
   * 显示隐藏输入框
   */
  to_detail(e){
    var that = this;
    console.log(e);
    var x = e.detail.x;
    var y = e.detail.y;
    if(y<565){
      that.setData({
        "IO":false
      })
    }
    
  },

  /**
   * 增加点击加载更多
   */
  to_loading(e) {
    var that = this;
    that.setData({
      loadingText: "正在加载",
    })
    var array1 = this.data.comList;
    var array2 = [];
    var len2 = 0;
    var Comment = Bmob.Object.extend("Comments");
    var comment = new Bmob.Query(Comment);
    // 查询所有数据
    comment.find({
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
          var obj = results[i];
          if (obj.get("shareId") == objId) {
            var com = {};
            com.nickName = obj.get("sellerName");
            com.touxiang = obj.get("avatarUrl");
            com.content = obj.get("content");
            com.school = obj.get("school")
            com.date = that.getDateDiff(obj.createdAt);
            array2.push(com);
            len2 = array2.length;
          }
          len = i;
        }
        console.log("元素全部装载成功");
        array1 = array1.concat(array2);
        if (that.data.loadingText == "已无更多") {
          that.setData({
            "comList": array1,
            "loadingText": "已无更多"
          })
        } else {
          that.setData({
            "comList": array1,
            "loadingText": "加载更多"
          })
        }
        if (that.data.comList.length == 0) {
          that.setData({
            "loadingText": "暂时还未有评论，快来占领沙发",
          })
        }
      },
    })
  },

  /**
   * 定义时间函数
   */
  getDateDiff: function (dateTimeStamp) {
    var result;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var before = new Date(dateTimeStamp).getTime();
    console.log("now--" + now);
    console.log("dateTimeStamp--" + dateTimeStamp);
    console.log("before--" + before);
    var diffValue = now - before;//时间差的毫秒数
    console.log("diffValue--" + diffValue);
    //计算出相差天数  
    var days = Math.floor(diffValue / (24 * 3600 * 1000))
    //计算出小时数  
    var leave1 = diffValue % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数  
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数  
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000)
    if (days > 90) {
      result = dateTimeStamp;
    } else if (days > 30) {
      result = "一月前";
    } else if (days > 7) {
      result = "一周前";
    } else if (days > 3) {
      result = "三天前";
    } else if (days > 2) {
      result = "前天";
    } else if (days > 1) {
      result = "昨天";
    } else if (hours > 1) {
      result = hours + "小时前";
    } else if (minutes > 1) {
      result = minutes + "分前";
    } else {
      result = seconds + "秒前";
    }
    return result;
  }
})