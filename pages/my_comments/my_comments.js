var app = getApp();
var Bmob = require('../../utils/bmob.js');
var moodsArr = [];
var likeObj = [];
var len = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    likeImg: '../../icon/love.png',
    loadingText: "加载更多",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    len = 0;
    that.getDateDiff();
    var len1 = 0;
    var Moods = Bmob.Object.extend("Moods");
    var moods = new Bmob.Query(Moods);
    // 查询所有数据
    moods.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id + ' - ' + object.get('openId'));
            if (object.get('openId')==app.globalData.openid){
                var moodsObj = {};
                console.log(object.id + ' - ' + object.get('title'));
                moodsObj.touxiang = object.get('avatarUrl');
                moodsObj.moodsId = object.id;
                moodsObj.openId = object.get('openId');
                moodsObj.nickName = object.get('sellerName');
                moodsObj.shareContent = object.get('content');
                // moodsObj.shareTime = that.getDateDiff(object.createdAt);
                moodsObj.shareTime = object.createdAt;
                moodsObj.school = object.get('school');
                moodsObj.shareImg = object.get('moodImg');
                likeObj = object.get('likeObj');
                moodsArr.push(moodsObj);
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
                // console.log("元素" + i + "装载成功");
                len1 = moodsArr.length;
                console.log("len1--" + len1);
                len = i;
                console.log("len--" + len);
                //判断查询数据是否为最后的数据
                if (len == 4) {
                    that.setData({
                        "loadingText": "已无更多",
                    })
                    break;
                }
            }
        }

        console.log("元素全部装载成功");
        moodsArr = moodsArr.reverse();
        console.log("moodsArr.length--"+moodsArr.length);
        wx.showLoading({
            title: '加载中',
            duration: 2000,
            success: function () {
                setTimeout(function () {
                    wx.hideLoading();
                    that.setData({
                        "moodsList": moodsArr
                    });
                }, 2000)
            }
        });
        // console.log("that.data.moodsList.length--" + that.data.moodsList.length);
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
  //发布动态
  to_my_add: function (e) {
      wx.navigateTo({
          url: '../active/active',
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      moodsArr= [];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    moodsArr=[];
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
    this.to_loading();
  },

  to_delete:function(e){
      var ids = e.currentTarget.id;
      console.log(e);
      var Goods = Bmob.Object.extend("Moods");
      var goods = new Bmob.Query(Goods);
      var that = this;
      wx.showModal({
          title: '提示',
          content: '亲，确定要删除这个商品记录吗？',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定');
                  goods.get(ids, {
                      success: function (result) {
                          console.log(result.get('moodImg'));
                         // 查询成功，调用get方法获取对应属性的值
                         var length =0 ;
                         if (result.get("moodImg")){
                             length = result.get("moodImg").length;
                         }else{
                             
                         }
                         for (var i = 0; i < length; i++) {
                              var imgs = result.get("moodImg[" + i + "]");
                              if (imgs) {
                                  console.log("图片存在");
                                  var path;
                                  path = imgs;
                                  var s = new Bmob.Files.del(path).then(function (res) {
                                      if (res.msg == "ok") {
                                          console.log('删除成功');
                                      }
                                  },
                                      function (error) {
                                          console.log(error)
                                      });
                              } else {
                                  console.log("图片不存在");
                              }
                          }
                          console.log("查询成功");
                          var Diary = Bmob.Object.extend("Moods");
                          var query = new Bmob.Query(Diary);
                          query.get(ids, {
                              success: function (object) {
                                  // The object was retrieved successfully.
                                  object.destroy({
                                      success: function (deleteObject) {
                                          console.log("删除成功");
                                          var index = e.currentTarget.dataset.index;
                                          var moodsArr = that.data.moodsList;
                                          moodsArr.splice(index, 1);
                                          wx.showToast({
                                              title: '删除成功',
                                              icon: 'success',
                                              duration: 2000,
                                              success: function () {
                                                  setTimeout(function () {
                                                      that.setData({
                                                          "moodsList": moodsArr
                                                      })
                                                  }, 2000)
                                              }
                                          })
                                      },
                                      error: function (object, error) {
                                          console.log('删除日记失败');
                                      }
                                  });
                              },
                              error: function (object, error) {
                                  console.log("query object fail");
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
   * 增加发布新动态分享
   */
  to_addActive: function (e) {
    wx.navigateTo({
      url: '../active/active',
    })
  },

  /**
   * 增加点击加载更多
   */
  to_loading(e) {
//     var that = this;
//     console.log("已加载的数组长度为："+that.data.moodsList.length)
//     console.log("len-----" + len);
//     that.setData({
//       loadingText: "正在加载",
//     })
//     var array1 = this.data.moodsList;
//     var array2 = [];
//     var len2 = 0;
//     var Moods = Bmob.Object.extend("Moods");
//     var moods = new Bmob.Query(Moods);
//     // 查询所有数据
//     moods.find({
//       success: function (results) {
//         console.log("共查询到 " + results.length + " 条记录");
//         // 循环处理查询到的数据
//         console.log(len);
//         //从len - 1开始循环加载
//         for (var i = len - 1; len2 < 5; i--) {
//           if (len == 0) {     //判断数据是否全部加载完成
//             that.setData({
//               "loadingText": "已无更多",
//             })
//             break;
//           }
//           if (results[i].get("openId") == app.globalData.openid) {
//             var moodsObj = {};
//             var object = results[i];
//             console.log(object.id + ' - ' + object.get('title'));
//             moodsObj.touxiang = object.get('avatarUrl');
//             moodsObj.moodsId = object.id;
//             moodsObj.openId = object.get("openId");
//             moodsObj.nickName = object.get('sellerName');
//             moodsObj.shareContent = object.get('content');
//             // moodsObj.shareTime = that.getDateDiff(object.createdAt);
//             moodsObj.shareTime = object.createdAt;
//             moodsObj.school = object.get('school');
//             // moodsObj.shareImg = [];
//             moodsObj.shareImg = object.get('moodImg');
//             likeObj = object.get('likeObj');
//             if (likeObj == null || likeObj.length == 0) {
//               moodsObj.likeImg = '../../icon/love.png';
//               moodsObj.likeNum = "";
//             } else {
//               console.log("likeObj数组长度为" + likeObj.length);
//               moodsObj.likeNum = likeObj.length;
//               for (var j = 0; j < likeObj.length; j++) {
//                 if (likeObj[j] == app.globalData.openid) {
//                   moodsObj.likeImg = '../../icon/loved.png';
//                   break;
//                 }
//                 moodsObj.likeImg = '../../icon/love.png';
//               }
//             }
//             console.log(moodsObj.likeNum);
//             console.log("元素" + i + "装载成功");
//             array2.push(moodsObj);
//             len = i;
//             console.log("len--" + len);
//             len2 = array2.length;
//             console.log("len2--" + len2);
//           }
//         }
//         console.log("元素全部装载成功");
//         // array2.reverse();
//         array1 = array1.concat(array2);
//         if (that.data.loadingText == "已无更多") {
//           that.setData({
//             "moodsList": array1,
//             "loadingText": "已无更多"
//           })
//         } else {
//           that.setData({
//             "moodsList": array1,
//             "loadingText": "加载更多"
//           })
//         }
//       },
//     })
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
      result = hours+"小时前";
    } else if (minutes > 1) {
      result = minutes+"分前";
    } else {
      result = seconds+"秒前";
    }
    return result;
  }

})