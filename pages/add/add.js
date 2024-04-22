// pages/add/add.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    currentDate: new Date().getTime(),
    backGroundColorList: [{
        index: "#E1E1E2"
      },
      {
        index: ""
      },
      {
        index: ""
      },
      {
        index: ""
      },
      {
        index: ""
      }
    ],
    iconId: 0,
    flag: false,
    inputMoneyValue: "",
    inputNameValue: "",
    show: false
  },
  //切换tab栏获取id
  onClickTab(e) {
    this.setData({
      active: e.detail.name
    })
  },
  //显示遮罩层
  showMask(e) {
    var that = this;
    var curname = e.currentTarget.dataset.num; //接收自定义的参数data-num
    //遍历取消所有的遮罩层，再给选中的参数赋值
    for (var i = 0; i < 5; i++) {
      that.setData({
        [`backGroundColorList[${i}].index`]: ""
      });
    }
    that.setData({
      [`backGroundColorList[${curname}].index`]: "#E1E1E2"
    });
    //绑定后台交互所用的字段
    that.setData({
      iconId: curname
    });
  },
  //保存按钮
  backToDetail() {
    var that = this
    wx.showModal({
      title: '',
      content: '是否要添加？',
      success: res => {
        if (res.confirm) {
          //逻辑判断
          if (this.data.inputMoneyValue == "" || (!(/(^[0-9]*$)/.test(this.data.inputMoneyValue)))) {
            return wx.showToast({
              title: '输入名字和数目',
              icon: 'error'
            })
          }
          //如果是支出页面将money改成负数
          if (this.data.active == 0) {
            this.setData({
              inputMoneyValue: "-" + this.data.inputMoneyValue
            })
          }else{ //如果是收入页面，id加5
            this.setData({
              iconId: that.data.iconId + 5
            })
          }
          //字符串转数字
          this.setData({
            inputMoneyValue: (+this.data.inputMoneyValue)
          })
          //添加进去数据库
          const db = wx.cloud.database()
          db.collection('bill').add({
            data: {
              date: that.data.currentDate,
              iconId: that.data.iconId,
              money: that.data.inputMoneyValue,
              name: that.data.inputNameValue
            },
            success: function (res) {
              //返回首页
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消----')
        }
      }
    })


  },
  //触发日历选择器
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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