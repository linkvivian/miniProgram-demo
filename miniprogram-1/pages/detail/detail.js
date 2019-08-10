// pages/detail/detail.js
let datas = require('../../datas/list-data');
let appData = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    isCollected: false,
    index: 0,
    isMusicPlay: false
  },

  // 点击处理收藏文章的方法
  handleCollection(){
    let isCollected = !this.data.isCollected;
    // 思考：
    /*
    * 1. 用户没有点过收藏
    *   1) 存储到storage
    *
    *
    * 2. 用户点击过收藏
    * */

    //1) 存储到storage

    // 存储之前先获取之前的数据
    let obj = wx.getStorageSync('isCollected');
    obj[this.data.index] = isCollected;
    // 提示用户收藏的状态
    let title = isCollected?'收藏成功': '取消收藏';
    wx.showToast({
      title,
      icon: 'success'
    });
    wx.setStorage({
      key: 'isCollected',
      data: obj
    });
    this.setData({isCollected});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 获取传递过来的数据，更新当前的data
    this.setData({ detailObj: datas.list_data[options.index], index: options.index});
    // 获取本地存储数据
    let storageObj = wx.getStorageSync('isCollected');
    console.log(storageObj);
    // 判断是否存储过数据
    if(!storageObj){
      storageObj = {};
      wx.setStorage({
        key: 'isCollected',
        data: storageObj
      });
    }else {
      // 根据是否收藏当前页面文章的的标识动态生成isCollected
      let isCollected = storageObj[options.index]? true: false;
      // 更新isCollected的值。
      this.setData({isCollected});
    }
   
    // 判断当前页面音乐是否播放
    if(appData.data.isPlay && appData.data.pageIndex === this.data.index){
      this.setData({
        isMusicPlay: true
      })
    }

    // 监听背景音乐的播放
    wx.onBackgroundAudioPlay(() => {
      // console.log('音乐播放');
      this.setData({
        isMusicPlay: true
      })
      //修改app.js的变量（类似于全局变量）
      appData.data.isPlay = true;
      appData.data.pageIndex = this.data.index;
    })

    // 监听背景音乐暂停。
    wx.onBackgroundAudioPause(() => {
      // console.log('音乐暂停');
      this.setData({
        isMusicPlay: false
      })
      appData.data.isPlay = false;
    })


  },

  // 控制音乐播放
  musicControl(){
    let isMusicPlay = !this.data.isMusicPlay;
    let {dataUrl, title, coverImgUrl} = this.data.detailObj.music;
    if (isMusicPlay){ // 音乐播放
      wx.playBackgroundAudio({
        dataUrl,title,coverImgUrl
      });

    }else { // 音乐暂停
      wx.pauseBackgroundAudio()
    }
    this.setData({isMusicPlay});
  },

  // 点击分享按钮
  handleShare() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到qq空间', '分享到微信好友'],
      itemColor: '#666'
    })
  }

})