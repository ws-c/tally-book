// pages/detail/detail.js



Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(), //获取现在月份一号的时间戳
    show: false,
    searchValue: '',
    listData: [],
    totalExpenditure: 0,
    totalIncome: 0,
    sum: 0,
    imgSrcList: ["../../images/icon_clothes.png", "../../images/icon_food.png", "../../images/icon_other.png", "../../images/icon_shopping.png", "../../images/icon_traffic.png", "../../images/icon_donate.png", "../../images/icon_study.png", "../../images/icon_winning.png", "../../images/icon_salary.png", "../../images/icon_daily.png"],
    cateActive: false,
    triggered: false
  },
  //触发日历选择器
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
    var app = getApp()
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    //时间降序
    db.collection('bill').where({
      "_openid": app.globalData._openId,
      "date": (_.lt(that.data.currentDate + 2592000000)) //当月以及之前的记录
    }).orderBy('date', 'desc').get({
      success: function (res) {
        that.setData({
          listData: res.data
        })
      },
      error: function (res) {
        console.log(res);
        wx.showToast({
          title: '失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
    this.onClose()

  },
  //展示日历选择器
  showPopup() {
    this.setData({
      show: true
    });
  },
  //关闭日历选择器
  onClose() {
    this.setData({
      show: false
    });
  },
  //搜索框触发按钮
  onSearch(e) {
    this.setData({
      searchValue: e.detail,
    });
    //通过搜索框的内容精准匹配
    var app = getApp()
    var that = this
    const db = wx.cloud.database()
    db.collection('bill').where({
      "_openid": app.globalData._openId,
      "name": that.data.searchValue
    }).orderBy('date', 'desc').get({
      success: function (res) {
        that.setData({
          listData: res.data
        })
        if(res.data == ''){
          wx.showToast({
            title: '没有相关数据',
            icon: 'error',
            duration: 1000
          })
        }
      },
      error: function (res) {
        console.log(res);
        wx.showToast({
          title: '失败',
          icon: 'error',
          duration: 1000
        })
      }
    })
  },
  //搜索框取消按钮
  onCancel() {
    this.loadListData()
  },
  //获取数据列表
  loadListData() {
    var app = getApp()
    var that = this
    const db = wx.cloud.database()
    //时间降序
    db.collection('bill').orderBy('date', 'desc').where({
      "_openid": app.globalData._openId,
    }).get({
      success: function (res) {
        that.setData({
          listData: res.data
        })
        that.getTotal()
        
      },
      error: function (res) {
        console.log(res);
        wx.showToast({
          title: '失败',
          icon: 'error',
          duration: 2000
        })
      }
    })

  },
  //获取余额
  getTotal() {
    var sums = 0
    var addSum = 0
    var minSum = 0
    var addSumList
    var minSumList
    var that = this
    //获取总收入和总支出
    if (that.data.listData.length > 0) {
      addSumList = that.data.listData.filter(element => element.money > 0)
      addSumList.forEach(element => {
        addSum += element.money
      })

      minSumList = that.data.listData.filter(element => element.money < 0)
      minSumList.forEach(element => {
        minSum -= element.money
      })
    }
    sums = addSum - minSum
    //设置参数
    that.setData({
      sum: sums
    })
    that.setData({
      totalExpenditure: minSum
    })
    that.setData({
      totalIncome: addSum
    })
  },
  //触屏时变浅add按钮
  onMove() {
    this.setData({
      cateActive: true
    })
  },
  endMove() {
    this.setData({
      cateActive: false
    })
  },
  //长按跳转
  handleLongPress(e){
    wx.navigateTo({
      url: `/pages/modify/modify?id=${e.currentTarget.dataset.id}`,
    })
  },
  //自定义下拉刷新
  onScrollRefresh() {
    var that = this;
    this.loadListData()
    this.setData({
      currentDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
    })
    wx.showToast({
      title: '加载中',
      icon: "loading"
    })
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 1500);
  },
  getUserProfile(){
    wx.getUserProfile({
      desc: '登录', // 声明获取用户个人信息后的用途
      success: (res) => {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    wx.getStorage({
      key: 'nickName',
      success (res) {
        wx.showLoading({
          title: '加载中',
        })
        // that.getUserProfile()
        setTimeout(() => {
          that.loadListData()
          wx.hideLoading()
        }, 1000);
      },
      fail(res){
        wx.showModal({
          title: '温馨提示',
          content: '请授权微信登录后才能获取小程序完整体验',
          confirmText:'授权登录',
          showCancel: false,
          success(res){
            wx.showLoading({
              title: '加载中',
            })
            that.getUserProfile()
            setTimeout(() => {
              that.loadListData()
              wx.hideLoading()
            }, 1000);
          }
        })
      }
    })
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