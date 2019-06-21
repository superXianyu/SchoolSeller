var app = getApp();
var Bmob = require('../../utils/bmob.js');
var moodsArr = [];
var likeObj = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    likeImg: '../../icon/love.png',
    moodsList: [{}, {}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Moods = Bmob.Object.extend("Moods");
    var moods = new Bmob.Query(Moods);
    // 查询所有数据
    moods.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var moodsObj = {};
          var object = results[i];
          console.log(object.id + ' - ' + object.get('title'));
          moodsObj.touxiang = object.get('avatarUrl');
          moodsObj.moodsId = object.id;
          moodsObj.nickName = object.get('sellerName');
          moodsObj.shareContent = object.get('content');
          moodsObj.shareTime = object.createdAt;
          moodsObj.school = object.get('school');
          moodsObj.shareImg = object.get('moodImg');
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
          console.log("元素"+i+"装载成功");
          moodsArr.push(moodsObj);
        }
        console.log("元素全部装载成功");
        moodsArr.reverse();
        that.setData({
          "moodsList": moodsArr
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log('shareMenu share success')
        console.log('分享' + res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
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
    var that = this;
    var Moods = Bmob.Object.extend("Moods");
    var moods = new Bmob.Query(Moods);
    // 查询所有数据
    moods.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var moodsObj = {};
          var object = results[i];
          console.log(object.id + ' - ' + object.get('title'));
          moodsObj.touxiang = object.get('avatarUrl');
          moodsObj.moodsId = object.id;
          moodsObj.nickName = object.get('sellerName');
          moodsObj.shareContent = object.get('content');
          moodsObj.shareTime = object.createdAt;
          moodsObj.school = object.get('school');
          // moodsObj.shareImg = [];
          moodsObj.shareImg = object.get('moodImg');
          likeObj = object.get('likeObj');
          if (likeObj == null||likeObj.length == 0) {
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
        moodsArr.reverse();
        that.setData({
          "moodsList": moodsArr
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
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
      url: '../comments/comments?id='+objId
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
        if(likeObj == null){
          var num = 0;
        }else{
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
   * 增加发布新动态分享
   */
  to_addActive: function (e) {
    wx.navigateTo({
      url: '../active/active',
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
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      if (monthC <= 12)
        result = "" + parseInt(monthC) + "月前";
      else {
        result = "" + parseInt(monthC / 12) + "年前";
      }
    }
    else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  }
})