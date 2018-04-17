//index.js
//获取应用实例
const app = getApp()
var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toView: 'red',
    scrollTop: 100,
    listData:[],
    scrollviewHeight: 0,
    page:0,
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    this.init();
    this.getAuth();
    this.getList();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getAuth:function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
              });
            }
          })
        } else {
          wx.authorize({
            scope: "scope.userInfo",
            success: res => {
              console.log(res);
              this.getAuth();
            },
            fail: res => {
              console.log(res);
            }
          });

        }
      },
      fail: res => {
        console.log('get user info failed');
      }
    })
  },
  //scroll view
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(this.data.page)
    this.getList(this.data.page++)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  getList(page=1){
    wx.request({
      url: 'https://www.cheapyi.com/api/list',
      data:{
        currentPage:page,
        pageSize:20
      },
      success:(res) => {
        this.setData({
          listData: this.data.listData.concat(res.data.data)
        }) 
      }
    })
  },
  clickItem(event){
    let item = event.currentTarget.dataset.id
    app.globalData.focusItem = item;
    wx.navigateTo({
      url: '../history/history'
    })
  },
  goToHistory(){
    wx.navigateTo({
      url: '../history/history'
    })
  },
  goToLike(){
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  init(){
    var systemInfo = wx.getSystemInfoSync();
    app.globalData.systemInfo = systemInfo;
    var height = parseFloat(systemInfo.windowHeight);
    // console.log(height * (750 / height) - 107,222)
    this.setData({
      scrollviewHeight: (height - 126.5)+"px"
    });
  }
})
