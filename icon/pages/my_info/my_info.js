//pageas/my_info/my_info
var Bmob = require('../../utils/bmob.js');
var app = getApp();
var school;
  Page({
    data:{
      touxiang: '../../icon/touxiang.png',
      nick_name: '或许十条咸鱼'
    },
    onLoad: function () {
        var that = this;
        var User = Bmob.Object.extend("Users");
        var user = new Bmob.Query(User);
        user.get(app.globalData.id, {
            success: function (result) {
                // The object was retrieved successfully.
                console.log("该日记标题为" + result.get("title"));
                if(result.get("school")){
                    that.setData({
                        user_school: result.get("school")
                    });
                }else {
                    that.setData({
                        user_school: "请填写您的学校"
                    });
                }
            },
            error: function (result, error) {
                console.log("查询失败");
            }
        });
        that.setData({
            touxiang: app.globalData.userInfo.avatarUrl,
            nick_name: app.globalData.userInfo.nickName
        });
        console.log(app.globalData.userInfo.nickName);
    },
    school_name(e) {
       school = e.detail.value;
        this.setData({
            dealPrice: e.detail.value
        })
    },
    sure:function(e){
        console.log("查询");
        var Users = Bmob.Object.extend("Users");
        var user = new Bmob.Query(Users);
        // 这个 id 是要修改条目的 objectId，你在这个存储并成功时可以获取到，请看前面的文档
        user.get(app.globalData.id, {
            success: function (result) {
                // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
                result.set('school', school);
                result.save();
                app.globalData.userSchool = school;
                console.log(app.globalData.useerSchool);
                //修改成功之后弹出成功提示并跳转到首页
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        setTimeout(function () {
                            wx.switchTab({
                                url: '../girl/girl',
                            })
                        }, 2000)
                    }
                });
                // The object was retrieved successfully.
            },
            error: function (object, error) {

            }
        });
    }
  })