// pages/modify/modify.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: "",
    active: 0,
    currentDate: "",
    backGroundColorList: [{
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
      },
      {
        index: ""
      }
    ],
    iconId: 0,
    flag: false,
    inputMoneyValue: "",
    inputNameValue: "",
    show: false,
  },
  //切换tab栏获取id（支出还是收入）
  onChangeTab(e) {
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
      content: '是否要保存？',
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
          //修改数据库

          const db = wx.cloud.database()
          db.collection('bill').doc(that.data.query).set({
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
  //删除按钮
  onDelete() {
    var app = getApp()
    var that = this
    wx.showModal({
      title: '',
      content: '是否要删除？',
      success: res => {
        if (res.confirm) {
          //删除数据库指定数据
          const db = wx.cloud.database()
          db.collection('bill').where({
            //先查询
            _openid: app.globalData._openId,
            _id: that.data.query
          }).remove({
            success: function (res) {
              //返回首页
              console.log(res.data)
              wx.navigateBack({
                delta: 1,
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
  //通过id获取数据
  getData() {
    var app = getApp()
    var that = this
    const db = wx.cloud.database()
    //根据id找到相应的数据列表
    db.collection('bill').where({
      "_openid": app.globalData._openId,
      _id: that.data.query
    }).get({
      success: function (res) {
        that.setData({
          currentDate: res.data[0].date,
          inputMoneyValue: Math.abs(res.data[0].money), //强制转正数
          inputNameValue: res.data[0].name,
          iconId: res.data[0].iconId
        })
        if(that.data.iconId >4){
          that.setData({
            active: 1,
            iconId: that.data.iconId -5
          })
        }
        that.setData({
          [`backGroundColorList[${that.data.iconId}].index`]: "#E1E1E2"
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
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //options等于传递过来的参数
    this.setData({
      query: options.id //赋值给data里的自定义对象query，供页面来使用
    })
    this.getData()

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