// pages/statistics/statistics.js

//导入echarts
import * as echarts from '../../ec-canvas/echarts'
let chart = null
let chart2 = null

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart)
  return chart
}
function initChart2(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart2)
  return chart2
}

function getOption(e) {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },

    series: [{
      name: 'Access From',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'inside',
        formatter: `{d}%`
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '15',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: e
    }]
  }
}
function getOption2(e) {
  let nameList = []
  e.forEach(item =>{
    nameList.push(item.name)
  })
  return {
    xAxis: {
      type: 'category',
      data: nameList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: e,
        type: 'bar'
      }
    ],
    label:{ // 柱状图 内部 显示数值
      show:true,
      rotate:30,
    },
    grid:{
      right: 10
    }
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    ec2:{
      onInit: initChart2
    },
    type: 'outcome',
    chartOptionData: {
      income: [],
      outcome: []
    },
    iconList: ["服装", "食物", "娱乐", "购物", "交通", "收款", "奖学金", "比赛奖金", "退税", "其他"],
    totalExpenditure: 0,
    totalIncome: 0,
    listData: [],
    moneyLength:{
      incomeLength: '',
      outcomeLength: ''
    }
  },
  changeType(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
    let option = getOption(this.data.chartOptionData[e.currentTarget.dataset.type])
    chart.setOption(option)
    let option2 = getOption2(this.data.chartOptionData[e.currentTarget.dataset.type])
    chart2.setOption(option2)
  },
  //获取余额
  getTotal() {
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
    that.setData({
      totalExpenditure: minSum
    })
    that.setData({
      totalIncome: addSum
    })
  },
  merge(arr) {
    // 1.首先由原始的数组arr数据，
    // 2.然后创建一个map空对象和一个dest空数组，通过判断map中是否含有某项来判断数组dest是否添加数据，
    // 3.然后再判断相同项和已有的dest数组内容比较合并；
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = arr[i];
      if (!map[ai.name]) {
        dest.push({
          name: ai.name,
          value: ai.value
        });
        map[ai.name] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.name == ai.name) {
            dj.value = (parseFloat(dj.value) + parseFloat(ai.value));
            break;
          }
        }
      }
    }
    return dest
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
    //每次打开默认支出标签页
    this.setData({
      type: 'outcome'
    })
    //加载数据
    var app = getApp()
    var that = this
    const db = wx.cloud.database()
    const outComeChartData = []
    const inComeChartData = []
    //时间降序
    db.collection('bill').orderBy('date', 'desc').where({
      "_openid": app.globalData._openId
    }).get({
      success: function (res) {
        that.setData({
          listData: res.data
        })
        //获取总支出和总收入
        that.getTotal()

        let data = res.data
        data.forEach(item => {
          //将大于0的对象输出到inComeChartData
          if (item.money > 0) {
            inComeChartData.push({
              value: item.money,
              name: that.data.iconList[item.iconId]
            })
          } else if (item.money < 0) {
            let money = Math.abs(item.money)
            outComeChartData.push({
              value: money,
              name: that.data.iconList[item.iconId]
            })
          }
        })
        //将数据放在对象数组里
        that.setData({
          chartOptionData: {
            income: that.merge(inComeChartData), //合并相同图标类型的数组
            outcome: that.merge(outComeChartData)
          },
          moneyLength:{
            incomeLength: inComeChartData.length,
            outcomeLength: outComeChartData.length
          }
        })

        //第一次默认加载支出页面
        setTimeout(() => {
          console.log(that.data.chartOptionData.outcome);
          let outComeOption = getOption(that.data.chartOptionData.outcome)
          chart.setOption(outComeOption)
          let option = getOption2(that.data.chartOptionData.outcome)
          chart2.setOption(option)
        }, 300);
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