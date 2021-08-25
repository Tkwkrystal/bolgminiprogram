// pages/houseDetail/houseDetail.js
const {
    formatTime
} = require("../../utils/util.js")
const db = wx.cloud.database()
let detail
var maxH = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        houseImages: [],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        circular: true,
        interval: 1500,
        duration: 500,
        Height: "",
        // 是否已关注用户，默认为否
        HasCollection: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        console.log(e)
        // let id = e.id
        // 查询blog详细信息
        // this.HoseDettail(id)
        detail = JSON.parse(e.detail)
        maxH = 0

        let userInfo = wx.getStorageSync('userInfo')
        let openid = userInfo.openid
        this.setData({
            detail: detail,
            user_id: openid
        })

        // 检查是否已关注用户 openid-当前登陆用户 detail.open_id-文章作者用户
        this.HasCollection(openid, detail.open_id)

    },
    imgHeight: function (e) {
        var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
        var imgh = e.detail.height; //图片高度
        var imgw = e.detail.width; //图片宽度
        let temH = winWid * imgh / imgw //当前加载的图片高度 等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
        if (temH > maxH) {
            maxH = temH
        }
        var swiperH = maxH + 22 + "px"
        this.setData({
            Height: swiperH //设置高度
        })
    },
    // 跳转编辑页面
    goedit(e){
        let url = '../publishBlog/publishBlog'
        let detailblog = {
            _id: detail._id,
            FormData: detail.FormData,
            photoInfo: detail.photoInfo
        }
        let fin = JSON.stringify(detailblog)
        wx.navigateTo({
            url: `${url}?detail=${fin}`,
        })
    },
    // 跳转他人主页
    gootheruser(e) {
        let url = '../otherpage/otherpage'
        let id = e.currentTarget.dataset.followerid
        wx.navigateTo({
            url: `${url}?id=${id}`,
        })
    },
    // 查询详情
    HoseDettail(id) {
        wx.showLoading({
            title: '加载中...'
        })
        let that = this
        db.collection('articles').where({
            _id: id
        }).get({
            success(res) {
                wx.hideLoading()
                console.log('detail-res', res)
                if (res.errMsg == "collection.get:ok") {
                    if (res.data.length > 0) {
                        let data = res.data[0]
                        that.SetLisDdata(data)


                        let userInfo = wx.getStorageSync('userInfo')
                        let openid = userInfo.openid
                        // 检查是否已关注用户
                        that.HasCollection(openid, data.open_id)
                    } else {
                        wx.showToast({
                            title: '网络错误,请返回重新打开',
                            mask: true,
                            icon: 'none'
                        })
                        wx.navigateBack({
                            delta: -1
                        })
                    }
                } else {
                    wx.showToast({
                        title: '网络错误,请返回重新打开',
                        mask: true,
                        icon: 'none'
                    })
                    wx.navigateBack({
                        delta: -1
                    })
                }
            },
            fail(err) {
                wx.hideLoading()
                console.log('detail-err', err)
                wx.showToast({
                    title: '网络错误,请返回重新打开',
                    mask: true,
                    icon: 'none'
                })
                wx.navigateBack({
                    delta: -1
                })
            }
        })
    },

    // 赋值
    SetLisDdata(data) {
        // let displayPhone = phone.replace(phone.substring(3, 7), "****")
        this.setData({
            detail: data,
        })
        wx.hideLoading()
    },

    // 跳转函数
    NavigateToCalculator: function (e) {
        console.log(e)
        wx.navigateTo({
            url: '../../CalculatorPackage/calculator/calculator',
        })
    },

    // 打电话
    CallPhone(e) {
        console.log(e, e.currentTarget.dataset.phone)
        let phoneNumber = e.currentTarget.dataset.phone
        let displayPhone = this.data.displayPhone
        wx.showModal({
            title: '温馨提示',
            content: `是否拨打${displayPhone}号码？`,
            confirmText: '确定拨打',
            confirmColor: '#0081ff',
            cancelText: '取消',
            cancelColor: '#acb5bd',
            success: res => {
                console.log(res)
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: phoneNumber,
                        success: res => {
                            console.log(res)
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                }
            },
            fail: err => {
                console.log(err)
            }
        })

    },


    // 检查是否已经收藏
    HasCollection(openid, followerID) {
        let that = this
        db.collection('user_relation')
            .where({
                relation_type: '1',
                user_id: openid,
                follower_id: followerID
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

    // 收藏信息
    Docollection(e) {
        let that = this
        if (e.currentTarget.dataset.userid == e.currentTarget.dataset.followerid) {
            wx.showToast({
                title: '不能关注自己！',
                icon: 'none'
            })
            return
        }

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
    },
    // 删除自己的文章
    deleteacticle(e) {
        wx.showLoading({
            title: '删除中...'
        })
        wx.cloud.callFunction({
            name: 'blogs',
            data: {
                type: 'deletemyblog',
                articleid: e.currentTarget.dataset.id
            },
            success: res => {
                wx.hideLoading()
                wx.navigateBack({
                    delta: 1
                })

            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '删除失败',
                })
                console.error('[数据库] [删除记录] 失败：', err)
            }
        })

    },
    // 点赞
    clickDianzan(e) {
        // 前端数组改变数据 - 点赞状态/点赞总数 
        if (detail.like_status == 1) {
            detail.like_status = 2
            detail.likesum -= 1
        } else {
            detail.like_status = 1
            detail.likesum += 1
        }
        // 点赞数据库like添加记录
        wx.cloud.callFunction({
            name: 'articles',
            data: {
                type: 'dianzan',
                articleId: e.currentTarget.dataset.article,
                authorId: e.currentTarget.dataset.author,
                userId: e.currentTarget.dataset.user,
                dianzan: detail.like_status,
            },
            success: res => {
                wx.hideLoading()
                wx.showToast({
                    title: detail.like_status == 1 ? '点赞成功' : '取消赞成功',
                    icon: 'success',
                    duration: 2000
                })
                this.setData({
                    detail: detail
                })
            },
            fail: err => {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    title: '点赞失败',
                    icon: 'success',
                    duration: 2000
                })

            },
        })

    },

    // 预约看房
    Appointment(e) {
        let that = this
        wx.showActionSheet({
            itemList: ['联系经纪人', '联系在线客服'],
            success(res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    // 打电话
                    that.CallPhone(e)
                }
                if (res.tapIndex == 1) {
                    wx.showToast({
                        title: '提示:请直接点击 “个人中心” 页面的客服按钮,即可连通在线客服。',
                        icon: 'none',
                        mask: true,
                        duration: 2000
                    })
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function (e) {

    },

    // 

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})