// pages/otherpage/otherpage.js
var app = getApp()
let otheropenid
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
        myfans: {
            "follows": 0,
            "fans": 0,
            "likes": 0
        },
        // 是否已关注用户，默认为否
        HasCollection: false,
        //  默认swiper的高度
        swiperheight: 240
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        let loginInfo = wx.getStorageSync('userInfo')
        this.setData({
            loginUser: loginInfo
        })
        wx.showLoading()
        /**
         * 获取当前设备的宽高
         */
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });

        // 获取传过来的用户 openid
        otheropenid = options.id
        // 查询该用户信息
        const db = wx.cloud.database()
        db.collection('user').where({
            _openid: otheropenid
        }).get({
            success(res) {
                console.log('otherinfo',res.data[0])
                wx.hideLoading()
                if (res.errMsg == "collection.get:ok") {
                    that.setData({
                        UserLogin: true,
                        userInfo: res.data[0]
                    })
                    // 获取文章列表
                    that.getarticles()
                    // 获取 关注/粉丝/获赞 
                    that.getuserfans(otheropenid)

                    // 检查是否已关注用户 a-当前登陆用户 b-文章作者用户
                    that.HasCollection(loginInfo.openid, otheropenid)
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log('查询该用户信息失败', err)
            }
        })



    },
    // 动态渲染swiper高度
    setswiperheight(element) {
        setTimeout(() => {
            let query = wx.createSelectorQuery();
            query.select(element).boundingClientRect(rect => {
                this.setData({
                    swiperheight: rect.height
                })
            }).exec();
        }, 800)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    // 检查是否已经关注
    HasCollection(openid, followerID) {
        let that = this
        const db = wx.cloud.database()
        db.collection('user_relation')
            .where({
                user_id: openid,
                follower_id: followerID,
                relation_type: '1'
            })
            .count({
                success(res) {
                    console.log('是否已关注', res)
                    if (res.errMsg == "collection.count:ok") {
                        if (res.total > 0) {
                            // 已关注
                            that.setData({
                                HasCollection: true
                            })
                        }
                    }
                },
                fail(err) {
                    console.log(err)
                }
            })
    },
    // 获取 关注/粉丝/获赞 
    getuserfans(userid) {
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
                that.setData({
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
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    //监听页面滚动
    onPageScroll: function (e) {
        this.setData({
            scrollTop: e.scrollTop
        })
    },
    // 跳转他人主页
    gootheruser(e) {
        let url = './otherpage'
        let id = e.currentTarget.dataset.followerid
        wx.navigateTo({
            url: `${url}?id=${id}`,
        })
    },

    // tab切换 0- 自己的文章/1-关注人列表
    bindChange: function (e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
        if (e.detail.current == '0') {
            this.getarticles()
        } else if (e.detail.current == '1') {
            this.getmyfollow()
        }else if(e.detail.current == '2'){
            this.getmyfanlist()
        }
    },
    // 是否关注
    Docollection(e) {
        let that = this
        // 用户不能关注自己--提示
        if (e.currentTarget.dataset.userid == e.currentTarget.dataset.followerid) {
            wx.showToast({
                title: '不能关注自己！',
                icon: 'none',
                duration: 2000
            })
        } else {
            // 用户关系数据库user_relation 添加记录
            wx.cloud.callFunction({
                name: 'articles',
                data: {
                    type: 'guanzhu',
                    userId: e.currentTarget.dataset.userid,
                    followerId: e.currentTarget.dataset.followerid,
                    guanzhu: that.data.HasCollection
                },
                success: res => {
                    wx.hideLoading()
                    this.setData({
                        HasCollection: !that.data.HasCollection
                    })
                    wx.showToast({
                        title: that.data.HasCollection ? '关注成功' : '已取消关注',
                        icon: 'success',
                        duration: 2000
                    })

                },
                fail: err => {
                    wx.hideLoading()
                    console.log(err)
                    wx.showToast({
                        title: '关注失败',
                        icon: 'success',
                        duration: 2000
                    })
                },
            })
        }


    },
    // 返回上一页
    goback() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 查询自己关注的人
    getmyfollow() {
        let that = this
        wx.cloud.callFunction({
            name: 'blogs',
            data: {
                type: 'getmyfollow',
                userid: otheropenid
            },
            success: res => {
                wx.hideLoading()
                console.log(res)
                that.setData({
                    centent_Show: res.result.list.length == 0?false:true,
                    followList: res.result.list,
                    swiperheight: res.result.list.length>0?res.result.list.length * 55 + 20:240
                })  
                // that.setswiperheight('#userlist')

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
           userid: otheropenid
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
    fillData: function (isFull, goods) {
        let view = this.selectComponent('#waterFallView');
        view.fillData(isFull, goods);
    },
    // 查询文章列表接口
    getarticles: function (e) {
        var that = this;
        this.setData({
            result_show: true
        })
        wx.cloud.callFunction({
            name: 'articles',
            data: {
                type: 'getmyarticles',
                userid: otheropenid
            },
            success: async res => {
                wx.hideLoading()
                // 前端处理点赞总数 去点赞数组的长度
                res.result.list.map(item => {
                    item.likesum = item.likesumarr.length
                })
                await that.fillData(true, res.result.list)
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