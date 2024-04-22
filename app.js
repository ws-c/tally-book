// app.js
App({
  
  onLaunch() {
    wx.cloud.init({
        env: "cloud1-0gc7u5kk60797a3d"
      }),
    
      wx.cloud.callFunction({
        name: 'getOpenid',
        success: (res) => {
          var app = getApp()  
          app.globalData._openId = res.result.openid
        }
      })
  },
  globalData: {
    userInfo: null,
    _openId: null
  }
})

      //  wx.login({
        
      //   //获取code
      //   success: function (res) {
      //     var code = res.code; //返回code
      //     var appId = 'wxe3bf6b6f1c6b1ca0'; //在网站获取
      //     var secret = 'b1570f872ba90edadaca576cd08338e8'; //在网站获取
      //     wx.request({
      //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
      //       data: {},
      //       header: {
      //         'content-type': 'json'
      //       },
      //       success: function (res) {
      //         var openid = res.data.openid //返回openid
      //         var app = getApp()  
      //         app.globalData._openId = openid
      //         // console.log('openid为' + app.globalData._openId);
      //       }
      //     })
      //   }
      // })