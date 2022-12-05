// pages/aboutUs/aboutUs.js
const db = wx.cloud.database()
const Administrator = db.collection('Administrator')
const Reward = db.collection('Reward')

Page({
  data: {
    authorInfo: {},
    show: false,
    amount: 10,
    authorInt: '19级应届毕业生,数信学院信息管理与信息系统专业。',
    introduce: "M: master。意指继续深造的同学； CS: civil servant。意指投身建设祖国行业的公务员；W: work。意指就业的同学。也许你想晒出你的offer，讨论薪资或比对公司。也许你在考研，希望寻找志同道合的朋友或收集资料。也许你已经上岸，想把你的经历分享给下一届的同学们。坐一盏指路的明灯...",
    email: 'katohuge@outlook.com',
    focus: false
  },

  /**
   * 页面加载
   */
  onLoad() {
    Administrator.doc('058dfefe630cb5b2174ca4fc61630491').get()
    .then(res => {
      this.setData({ authorInfo: res.data })
    })
  },

  // 打赏、鼓励作者
  encourage() {
    this.setData({
      show: true,
      focus: true
    })
  },

  // 模态框取消按钮的回调函数
  onClose() {
    this.setData({ show: false })
  },

  // 模态框支付按钮的回调函数
  onConfirm() {
    wx.showLoading({ title: '正在发起支付...' })

    const { nick_name, avatar_url } = wx.getStorageSync('currentUser')

    // 打赏表数据
    const data = {
      nick_name,
      avatar_url,
      amount: this.data.amount,
      reward_date: new Date(),
      status: 1
    }

    // 创建打赏表 发起微信支付
    Reward.add({data}).then(res => this.pay(res._id))
  },

  // 发起微信支付
  pay(rewardId) {
    // 调用支付云函数
    wx.cloud.callFunction({ name: 'pay', data:{ rewardId }})
    .then(res => {
      console.log('res', res)

      // 显示校验是否正确
      if(res.result?.code === 1) {
        wx.hideLoading()
        return wx.showToast({
          title: res.result.error,
          icon: 'none',
          duration: 3000
        })
      }

      console.info(JSON.stringify(res.result.payment))
      
      wx.hideLoading()
      // 发起微信支付
      wx.requestPayment({...res.result.payment})
      .then(() => {
        wx.showToast({
          title: '谢谢大佬的打赏！',
          icon: 'success',
          duration: 2000
        })
      })
      .catch(() => {
        wx.showToast({
          title: '支付失败！',
          icon: 'error',
          duration: 2000
        })
      })
    })
  }
})
