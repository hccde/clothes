// pages/detail/detail.js
const app = getApp();
const WXCharts = require('../../utils/wxchart.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:app.globalData.focusItem,
    chartData:[1,2,3,4]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //setview
    if(app.globalData.focusItem){
      this.setData({
        item: app.globalData.focusItem
      })
    }
    this.initCanvas();
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
  
  },
  initCanvas(){
    let history = this.data.item.History;
    let historyList = history.split('|'); //fixed error data
    let list = historyList.map((e)=>{
      return e.split(':').pop();
    });
    let data = new Array(today).fill(0);
    let today = new Date().getDay();
    for(let i = today-1;i>0;i--){
      data[i] = list.pop()||0;
    }
    new WXCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: '价格',
        data: data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: app.globalData.systemInfo.windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      },
    });
  }
})