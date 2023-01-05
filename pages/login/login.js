// pages/login/login.js
const app = getApp()

const db = wx.cloud.database()
const User = db.collection('User')

Page({
  data: {
    stateheight: app.globalData.stateheight,
    icon: '/static/images/login/six.png',
    coordinate: [
      {x: -20, y: 80},
      {x: 680, y: 150},
      {x: 300, y: 250},
      {x: -20, y: 450},
      {x: 620, y: 540},
      {x: 200, y: 700},
      {x: 500, y: 1400},
      {x: 50, y: 1300},
      {x: 650, y: 1200},
      {x: 180, y: 1460},
    ],
    adminOpenId: []
  },

  // 注册跳转
  jumpToRegistry(){
    wx.redirectTo({
      url: '/pages/registry/registry',
    })
  },

  // 登录的回调函数
  getUserProfile() {
    // 获取用户信息
    wx.getUserProfile({desc: "用于个人信息展示"}).then(res => {
      let user = {
        avatar_url: res.userInfo.avatarUrl,
        nick_name: res.userInfo.nickName,
        gender: res.userInfo.gender,
        autograph: '青春里的温柔一定与你相关',
        create_date: new Date()
      }
      // 将个人信息存储到本地
      wx.setStorageSync('currentUser', user)
      // 將用戶添加到数据库
      User.add({data: user}).then(() => {
        wx.reLaunch({ url: '/pages/index/index' })
      })
    })
  }
})
