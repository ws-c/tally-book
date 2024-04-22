// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "", //用户头像
    nickName: "", //用户昵称
    active: false,  //控制登录按钮开关
    showShare: false, //分享开关
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '微博', icon: 'weibo' },
      { name: '复制链接', icon: 'link' },
      { name: '分享海报', icon: 'poster' },
      { name: '二维码', icon: 'qrcode' },
    ],
    showRate: false, //评价开关
    valueRate: 3,  //评价星数
    saying: ''
  },
  //获取头像
  getUserProfile(){
    wx.getUserProfile({
      desc: '登录', // 声明获取用户个人信息后的用途
      success: (res) => {
        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          active: true
        })
        wx.setStorage({    //数据缓存方法
          key: 'nickName',   //关键字，本地缓存中指定的key
          data: res.userInfo.nickName,    //缓存微信用户公开信息，
          success: function() {      //缓存成功后，输出提示
            console.log('写入nickName缓存成功')
          },
          fail: function() {        //缓存失败后的提示
            console.log('写入nickName发生错误')
          }
        })
        wx.setStorage({    //数据缓存方法
          key: 'avatarUrl',   //关键字，本地缓存中指定的key
          data: res.userInfo.avatarUrl,    //缓存微信用户公开信息，
          success: function() {      //缓存成功后，输出提示
            console.log('写入avatarUrl缓存成功')
          },
          fail: function() {        //缓存失败后的提示
            console.log('写入avatarUrl发生错误')
          }
        })
      }
    })
   
  },
  //点击分享打开
  onClick(event) {
    this.setData({ showShare: true });
  },
  //点击分享关闭
  onClose() {
    this.setData({ showShare: false });
  },
  //点击分享选项时触发
  onSelect(event) {
    Toast(event.detail.name);
    this.onClose();
  },
  //控制弹出层
  showPopup() {
    this.setData({ showRate: true });
  },
  //关闭评价
  onCloseRate() {
    this.setData({ showRate: false });
  },
  //评价星星数量
  onChangeRates(event) {
    this.setData({
      valueRate: event.detail,
    });   
  },
  //提交评价
  submitRate(){
    this.onCloseRate()
    wx.showToast({
      title: '评价成功',
      icon: 'success'
    })
  },
  //跳转介绍页面
  toIntroduce(){
    wx.navigateTo({
      url: '/pages/introduce/introduce',
    })
  },
  //每日一言功能
  getSaying(){
    var that = this
    wx.request({
      url: 'https://v1.jinrishici.com/all.json',
      method: 'GET',
      success:(res)=>{
        that.setData({
          saying: res.data.content
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    setTimeout(() => {
      this.getSaying()
    }, 100);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    wx.getStorage({
      key: 'nickName',
      success (res) {
        that.setData({
          nickName:res.data,
          active: true
        })
      }
    })
    wx.getStorage({
      key: 'avatarUrl',
      success (res) {
        that.setData({
          avatarUrl:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})