// pages/login/login.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showAuth: true,
        showform: true,
        userInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
       
    },
    // 新的获取用户信息方式
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            this.setData({
                userInfo:res.userInfo
            })
            // 获取数据库的用户信息
            this.InitInfo(res.userInfo)
          }
        })
      },

    // 获取个人信息
    InitInfo(userInfo) {
        wx.showLoading({
            title: '正在加载...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'InitInfo',
            data: {
                type: 'INIT'
            },
            success: res => {
                wx.hideLoading()
                let result = res.result.data
                // 判断是否已经注册
                if (result.length) {
                    // 已注册 就设置本地缓存后跳转home首页
                    userInfo = result[0]
                    userInfo['openid'] = result[0]._openid
                    // 缓存到本地
                    wx.setStorageSync('userInfo', userInfo)
                    // 修改全局变量为已登录
                    app.IsLogon()
                    // 跳转到home
                    wx.switchTab({
                        url: '../home/home'
                    })
                } else {
                    // 显示注册页面，并提示注册
                    that.setData({
                        showAuth: false,
                        showform: true
                    })
                    wx.showToast({
                        title: '你还未注册，请填写注册信息！',
                        icon: 'none',
                        duration: 2500,
                        mask: true,
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('err', err)
                wx.showToast({
                    title: '网络错误，信息获取失败...',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: res => {
                console.log('complete', res)
            }
        })
    },

    // 获取输入框数据
    InputData: function (e) {
        console.log(e, e.currentTarget.id, e.detail.value)
        let userInfo = this.data.userInfo
        let id = e.currentTarget.id
        let value = e.detail.value
        userInfo[id] = value
        this.setData({
            userInfo
        })
    },

    // 提交注册信息
    SubmitRegister(e) {
        let that = this
        let userInfo = this.data.userInfo
        let name = userInfo['name'] || ''
        let phone = userInfo['phone'] || ''
        let tips = userInfo['tips'] || ''
        let { avatarUrl, nickName, city, country, gender, province, language} = userInfo
        // 校验手机号和姓名是否为空
        if(name == '' || phone == '' || tips == ''){
            wx.showToast({
                title: '请填写姓名/手机号/个性签名',
                icon: 'none',
                duration: 2000,
                mask: true,
            })
            return
        }
 
        // 保存
        wx.showLoading({
            mask: true,
            title: '正在保存...',
        })
        // 保存到数据库
        const dbname = "user"
        let db = wx.cloud.database()
        db.collection(dbname)
            .add({
                data: {
                    name: name,
                    phone: phone,
                    address: '',
                    avatarUrl: avatarUrl,
                    nickName: nickName,
                    city: city,
                    country: country,
                    gender: gender,
                    province: province,
                    language: language,
                    tips:tips,
                    mamager: false
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.errMsg == "collection.add:ok") {
                        wx.showToast({
                            title: '恭喜,注册成功！',
                            icon: 'none',
                            duration: 1000
                        })
                         // 获取数据库的用户信息
                        that.InitInfo(userInfo)
                    } else {
                        // 提示网络错误
                        wx.showToast({
                            title: '网络错误，注册失败，请检查网络后重试！',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function (err) {
                    wx.hideLoading()
                }
            })
    },

    // 返回首页
    onClickLeft() {
        wx.switchTab({
            url: '../home/home',
        })
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

    }
})