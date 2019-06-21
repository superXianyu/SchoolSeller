//pages/my_pulish.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
Page({
  data: {
    touxiang: '../../icon/touxiang.png',
    nick_name: '或许十条咸鱼',
    pulish_touxaing: '../../icon/close.jpg',
    describ_word: '桔梗同款cosplay衣服，八成新，三公寓门口验货',
    author: '或许十条咸鱼',
    is_time:'hidden_red_dot',
    zhaung_mess: 'zhaung_mess_ing',
    zhuang_tai_word: '在售中'
  },
  onLoad: function (e) {
      console.log(app.globalData.now+"输出的时间");
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1500)
    if(app.globalData.pubFresh){
      wx.showModal({
        title: '提示',
        content: '贷小红点的商品交易时间快到了呦，快去查看吧！！',
      })
      app.globalData.pubFresh = false;
    }
    var that = this;
    var goods_arry = [];
    var Goods = Bmob.Object.extend("Goods");
    var goods = new Bmob.Query(Goods);
    goods.equalTo("openId", app.globalData.openid);
    // 查询所有数据
    goods.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        that.setData({
          goods_num: results.length,
        });
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var goods_obj = {};
          var diff;
          var time0 = new Date(object.get("time")).toString();
          time0 = time0.substr(4, 12);
          var save_time= time0.split(" ");
          var now = app.globalData.now.split("-");
            switch(save_time[0]){
                case "Jan":save_time[0]=1;break;
                case "Feb": save_time[0] = 2; break;
                case "Mar": save_time[0] = 3; break;
                case "Apr": save_time[0] = 4; break;
                case "May": save_time[0] = 5; break;
                case "Jun": save_time[0] = 6; break;
                case "Jul": save_time[0] = 7; break;
                case "Aug": save_time[0] = 8; break;
                case "Sep": save_time[0] = 9; break;
                case "Oct": save_time[0] = 10; break;
                case "Nov": save_time[0] = 11; break;
                case "Dec": save_time[0] = 12; break;
                default:save_time[0]=0;break;
            }
            var year = parseInt(now[0])- parseInt(save_time[2]);
            var month = parseInt(now[1]) - parseInt(save_time[0]);
            var day = parseInt(now[2]) - parseInt(save_time[1]);
            console.log(save_time+"数据库获取的时间为"+now+"现在的时间");
            
            if(year<0){
                diff=1;
            }else{
                if(month<0&&year==0){
                    diff = 1;
                }else{
                    if(month==0&&year==0&&day<0){
                        diff = 1;
                    }else{
                            diff = -1;
                    }
                }
            }
            if (year == 0 && month == 0 && day == 0) {
                diff = 0;
            }
            console.log(year+""+month+""+day);
          console.log(diff);
          if(diff>=0){
              goods_obj.zhaung_mess = 'zhaung_mess_ing';
              goods_obj.zhuang_tai_word = "在售中";
              if ((diff == 0)) {
                  goods_obj.is_time = 'show_red_dot';
              }else{
                  goods_obj.is_time = 'hidden_red_dot';
              }
          }else{
              goods_obj.zhaung_mess = 'zhaung_mess_over';
              goods_obj.zhuang_tai_word = "已出售";
            goods_obj.is_time = 'hidden_red_dot';
          }
          
          console.log(object.id + ' - ' + object.get('sellerName'));
          goods_obj.author = object.get('sellerName');
          goods_obj.describ_word = object.get('miaoSu');
          goods_obj.imgs = object.get("goodsImg0");
          goods_obj.post_id = object.id;
          console.log(goods.post_id);
          goods_arry[i] = goods_obj;
        //   console.log(JSON.stringify(goods_arry[i]) + "上面");
        }
        goods_arry.reverse();
        wx.showLoading({
          title: '加载中',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.hideLoading();
              that.setData({
                "goods_num": goods_arry
              });
            }, 500)
          }
        });

        // console.log(JSON.stringify(goods_arry[0]) + '\n' + JSON.stringify(goods_arry[1]));
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

    that.setData({
      "touxiang": app.globalData.userInfo.avatarUrl,
      "nick_name": app.globalData.userInfo.nickName,
      "goods_num": goods_arry
    });
  },
  onShow: function () {
    this.onLoad();
  },

  //用于记录开始触摸的初始点
  touch_s: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      })
    }
  },

  touch_e: function (e) {
    if (e.touches.length == 1) {
      console.log("开始运行");
      var endX = e.touches[0].clientX;
      var cha = this.data.startX - endX;
      var end_style = "right:0px";
      if (cha < 60) {
        end_style = "right:0px";
      } else {
        end_style = "right:100px";
      }
      var index = e.currentTarget.dataset.index;
      var goods_num = this.data.goods_num;
      console.log("结束" + index + mov_style + JSON.stringify(e.currentTarget));
      goods_num[index].mov_style = end_style;
      this.setData({
        "goods_num": goods_num
      })
    }
  },
  //用户开始移动时候
  touch_m: function (e) {
    var that = this;
    var mov_style = "right:0px";
    if (e.touches.length == 1) {
      var movX = e.touches[0].clientX;
      var cha = that.data.startX - movX;
      console.log(cha);
      if (cha <= 0) {
        mov_style = "right:0px";
      } else {
        if (cha <= 60) {
          mov_style = "right:" + cha + "px";
        } else {
          if (cha > 60 && cha <= 100) {
            mov_style = "right:" + cha + "px";
          } else {
            if (cha > 100) {
              mov_style = "right:100px";
            }
          }
        }

      }
      var index = e.currentTarget.dataset.index;
      var goods_num = this.data.goods_num;
      console.log(index + mov_style + JSON.stringify(e.currentTarget));
      goods_num[index].mov_style = mov_style;
      this.setData({
        "goods_num": goods_num
      })
    }
  },
  del_message: function (e) {
    var ids = e.currentTarget.dataset.post_id;
    console.log(ids);
    var Goods = Bmob.Object.extend("Goods");
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
              // 查询成功，调用get方法获取对应属性的值
              for (var i = 0; i < 6; i++) {
                var imgs = result.get("goodsImg" + i + "");
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
              var Diary = Bmob.Object.extend("Goods");
              var query = new Bmob.Query(Diary);
              query.get(ids, {
                  success: function (object) {
                      // The object was retrieved successfully.
                      object.destroy({
                          success: function (deleteObject) {
                              console.log("删除成功");
                            var index = e.currentTarget.dataset.index;
                            var goods_num = that.data.goods_num;
                            goods_num.splice(index, 1);
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 2000,
                                success: function () {
                                setTimeout(function () {
                                    that.setData({
                                    "goods_num": goods_num
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
    //查询单条数据，第一个参数是这条数据的objectId值
  },
  to_goods: function (e) {
    var post_id = e.target.dataset.post_id;
    console.log(post_id);
    wx.navigateTo({
      url: '../goods/goods?post_id=' + post_id
    })
  }
})
