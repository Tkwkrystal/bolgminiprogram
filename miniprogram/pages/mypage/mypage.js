// pages/mypage/mypage.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        centent_Show:true,
        fanslist_Show:true,
        UserLogin: false,
        userInfo: null,
        Adminstator: false,
        // 点击次数记录
        TapAccount: 0,
        // tabs切换
        currentTab: 0,
        // 关注/粉丝/获赞
        myfans:{"follows":0,"fans":0,"likes":0},
          //  默认swiper的高度
          swiperheight:240,
            // 点击次数记录
        TapAccount: 0
    },
      // 获取个人信息
      InitInfo() {
        wx.showLoading({
            title: '正在登录...',
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
                console.log('res', result)

                // 判断是否已经注册
                if (result.length) {
                    // 已注册
                    let userInfo = result[0]
                    userInfo['openid'] = result[0]._openid
                    // 修改库变量
                    app.globalData = {
                        userInfo: userInfo,
                        UserLogin: true
                    }
                    // 修改登录状态
                    that.setData({
                        userInfo: userInfo,
                        UserLogin: true
                    })
                    // 缓存到本地
                    wx.setStorageSync('userInfo', userInfo)
                    console.log('appdata', app.globalData)


                    if (app.globalData.UserLogin) {
                        // 获取推荐列表的数据
                        this.getarticles()
                        // 骨架屏幕消失
                        this.setData({
                            loading: false
                          })
                      }
                   
                } else {
                    // 未注册，页面跳转到授权注册页面
                    // wx.redirectTo({
                    //     url: '../login/login?id=register'
                    // })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('err', err)
                wx.showToast({
                    title: '网络错误，登录失败...',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: res => {
                console.log('complete', res)
            }
        })
    },
      /**
     * 检查授权情况
     */
    IsAuthor: function () {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                   // 获取数据库的用户信息
                   that.InitInfo()
                } else {
                    // 未授权，跳转到授权页面
                    // wx.redirectTo({
                    //     url: '../login/login?id=auth'
                    // })
                    
                       // 获取推荐列表的数据
                       this.getarticles()
                       // 骨架屏幕消失
                       this.setData({
                           loading: false
                         })
                }
            },
            fail: function (err) {
                wx.hideLoading()
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
 // 删除本地缓存
        wx.removeStorageSync('userInfo')
 // 获取个人信息，如果不存在，则跳转到认证页面
                this.IsAuthor()
        
        var that = this;
        /**
         * 获取当前设备的宽高
         */
        wx.getSystemInfo( {
            success: function( res ) {
                that.setData( {
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
    
        });
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
      
        app.IsLogon()
        console.log(app.globalData)
        // 全局变量
        let globalData = app.globalData
        let userInfo = globalData.userInfo
        this.setData({
            UserLogin: globalData.UserLogin,
            userInfo: userInfo
        })
        if(globalData.UserLogin){
             // 获取文章列表
            this.getarticles()
            // 获取 关注/粉丝/获赞 
            this.getuserfans(userInfo.openid)
        }
       
    },

        // 秘密入口
        ScanPage() {
            let TapAccount = this.data.TapAccount
            TapAccount = TapAccount + 1
            if (TapAccount < 5) {
                this.setData({
                    TapAccount: TapAccount
                })
            } else {
                wx.redirectTo({
                    url: '../publishBlog/publishBlog',
                })
            }
        },

 // 获取 关注/粉丝/获赞 
 getuserfans(userid){
    wx.showLoading()
    var that = this;
    wx.cloud.callFunction({
        name: 'blogs',
        data: {
            type: 'getmyfans',
            userid: userid
        },
        success: res => {
            wx.hideLoading()
            console.log(res)
            that.setData( {
                myfans: res.result
            })
        },
        fail: err => {
            wx.hideLoading()
            console.log(err)
            wx.showToast({
                title: '查询失败',
                icon: 'success',
                duration: 2000
            })
        },
    })
 },
   //  tab切换逻辑
   swichNav: function( e ) {
    var that = this;
    if( this.data.currentTab === e.target.dataset.current ) {
        return false;
    } else {
        that.setData( {
            currentTab: e.target.dataset.current
        })
    }
},
//监听页面滚动
onPageScroll:function(e){
    this.setData({
        scrollTop: e.scrollTop
    })
  },
// 跳转他人主页
gootheruser(e){
    let url = '../otherpage/otherpage'
    let id = e.currentTarget.dataset.followerid
        wx.navigateTo({
            url: `${url}?id=${id}`,
        })
},

// tab切换 0- 自己的文章/1-关注人列表
bindChange: function( e ) {
    var that = this;
    that.setData( { currentTab: e.detail.current });
    if(e.detail.current == '0'){
        this.getarticles()
    }else if(e.detail.current == '1'){
        this.getmyfollow()
    }else if(e.detail.current == '2'){
        this.getmyfanlist()
    }
},
// 查询自己关注的人
 getmyfollow(){
     let that = this
     wx.showLoading()

    wx.cloud.callFunction({
        name: 'blogs',
        data: {
            type: 'getmyfollow',
            userid: that.data.userInfo.openid
        },
        success: res => {
            wx.hideLoading()
            console.log(res)
            that.setData({
                centent_Show: res.result.list.length == 0?false:true,
                followList: res.result.list,
                swiperheight: res.result.list.length>0?res.result.list.length * 55 + 20:240
            })  
        },
        fail: err => {
            wx.hideLoading()
            console.log(err)
            wx.showToast({
                title: '查询关注人失败',
                icon: 'success',
                duration: 2000
            })

        },
    })
 },
 // 查询粉丝列表
 getmyfanlist(){
    let that = this
    wx.showLoading()

   wx.cloud.callFunction({
       name: 'blogs',
       data: {
           type: 'getmyfanlist',
           userid: that.data.userInfo.openid
       },
       success: res => {
           wx.hideLoading()
           console.log(res)
           that.setData({
                fanslist_Show: res.result.list.length == 0?false:true,
               fansList: res.result.list,
               swiperheight: res.result.list.length>0?res.result.list.length * 55 + 20:240
           })  
       },
       fail: err => {
           wx.hideLoading()
           console.log(err)
           wx.showToast({
               title: '查询关注人失败',
               icon: 'success',
               duration: 2000
           })

       },
   })
},
// 给文章列表组件传参数
fillData: function (isFull,goods){
    let view = this.selectComponent('#waterFallView');
    view.fillData(isFull, goods);
  },
     // 查询文章列表接口
     getarticles: function (e) {
        wx.showLoading()
        var that = this;
        this.setData({
            result_show: true
        })
        wx.cloud.callFunction({
            name: 'articles',
            data: {
                type: 'getmyarticles',
                userid: that.data.userInfo.openid
            },
            success: async res => {
                wx.hideLoading()
                // 前端处理点赞总数 去点赞数组的长度
                res.result.list.map(item => {
                    item.likesum = item.likesumarr.length
                })
                await that.fillData(true,res.result.list)
                // 设置swiper高度
                const child = this.selectComponent('#waterFallView')
                let left = child.data.leftHeight
                let right = child.data.rightHeight
                this.setData({
                    swiperheight: left>right?parseInt(left+70):parseInt(right+60)
                })  
                // that.setswiperheight('#waterFallView')
            },
            fail: err => {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: '查询失败',
                    icon: 'success',
                    duration: 2000
                })

            },
        })

    },
    // 动态渲染swiper高度
    setswiperheight(element){
        setTimeout(() => {
            let query = wx.createSelectorQuery();
            query.select(element).boundingClientRect(rect=>{
                this.setData({
                    swiperheight: rect.height
                })        
                }).exec();  
            }, 500)
    },
    // 检查是否为管理员
    IsAdminstator() {
        wx.showLoading({
            title: '正在检验...',
            mask: true
        })
        let that = this
        wx.cloud.callFunction({
            name: 'InitInfo',
            data: {
                type: 'ADMIN'
            },
            success: res => {
                wx.hideLoading()
                console.log('adminres', res)
                if (res.result.total > 0) {
                    that.setData({
                        Adminstator: true
                    })
                    // 管理员跳转到管理员页面
                    var url = '../../Adminpackage/managerHome/managerHome'
                    var title = '进入管理员页面'
                    var id = that.data.userInfo.nickName
                } else {
                    // 不是管理员，跳转到扫码页面
                    var url = '../../Adminpackage/scanPage/scanPage'
                    var title = '扫码'
                    var id = 'mypage'
                }

                wx.showToast({
                    title: title,
                    icon: 'none'
                })
                that.setData({
                    TapAccount: 0
                })
                wx.navigateTo({
                    url: `${url}?id=${id}`,
                })
            },
            fail: err => {
                wx.hideLoading()
                console.log('err', err)
            }
        })
    },


    // 跳转函数
    Navigate: function (e) {
        console.log(e, e.currentTarget.dataset.url)
        console.log(e, e.currentTarget.dataset)
        let url = e.currentTarget.dataset.url
        let id = e.currentTarget.dataset.id
        let UserLogin = this.data.UserLogin
        if (UserLogin) {
            wx.navigateTo({
                url: `${url}?id=${id}`,
            })
        } else {
            // 提示登录
            wx.showToast({
                title: '你还未登录，请先登录！',
                icon: 'none',
                duration: 2500,
                mask: true,
            })
        }
    },

    // 跳转到登录页
    NavigateToLogin: function (e) {
        wx.navigateTo({
            url: '../login/login'
        })
    },

    // 清除数据
    CleanInfo() {
        wx.showLoading({
            title: '正在清除...',
            mask: true
        })
        let that = this
        setTimeout(
            function () {
                wx.hideLoading()
                wx.showToast({
                    title: '清除成功',
                    mask: true
                })
                that.setData({
                    UserLogin: false,
                    Adminstator: false
                })
                wx.removeStorageSync('userInfo')
            }, 2000
        )
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