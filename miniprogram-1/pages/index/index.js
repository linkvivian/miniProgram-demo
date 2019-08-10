//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    isShow: true
  },

  /**
   * 页面跳转功能
   * **/
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '/pages/list/index'
    })
  },

  /**
   * 登录功能
   * **/
  //1判断授权 →2允许授权(或已授权过) →3获取用户数据
  getUserInfo() {
  //判断用户是否授权,显示登录按钮与否
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          //若已经授权过
          this.setData({
            isShow: false
          })
        }
      }
    })
   
   //获取用户信息
    wx.getUserInfo({
      success: res => {
        // app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
        })
      },
      fail: () => {
        console.log('获取用户数据失败')
      }
    })
  },

  //用户允许授权信息之后执行的回调
  onGotUserInfo(data) {
    if (data.detail.rawData) {
      //用户点击了允许
      this.getUserInfo()  
    }
  }, 

  onLoad: function () {
    //页面初始渲染做的事
    this.getUserInfo()
  }
})
