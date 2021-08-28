var app = getApp();
var searchValue = '';
let loginInfo = {}
// pages/search/search.js
Page({
  data: {
    centent_Show: true,
    searchValue: '',
    img: '',
    nanshen_card: '',
    result_show: false,
    articlesList: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },
  onLoad: function () {
    var that = this;
    if(app.globalData.UserLogin){
      loginInfo = wx.getStorageSync('userInfo')
      that.setData({
        loginInfo: loginInfo
      });
    }else{
        // 提示需要授权
        this.showneedlogin()
    }
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
   
  },

  // 跳转他人主页
  gootheruser(e) {
    let url = '../otherpage/otherpage'
    let id = e.currentTarget.dataset.followerid
    wx.navigateTo({
      url: `${url}?id=${id}`,
    })
  },

  // 搜索用户名称列表
  getmyfollow() {
    let that = this
    console.log('loginInfo',loginInfo.openid)
    console.log('searchValue',that.data.searchValue)
    wx.cloud.callFunction({
      name: 'blogs',
      data: {
        type: 'searchuser',
        searchValue: that.data.searchValue || '',
        loginid: loginInfo._openid
      },
      success: res => {
        wx.hideLoading()
        console.log('searchNames',res)
        if(res.result.list.length == 0){
              this.setData({
        centent_Show: false,
      });
        }else{
          this.setData({
            centent_Show: true,
          });
        }
        that.setData({
          followList: res.result.list,
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
        this.setData({
          centent_Show: false,
        });
      },
    })
  },
  // 绑定搜索内容
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
    // if (!value && this.data.articlesList.length == 0) {
    //   this.setData({
    //     centent_Show: false,
    //   });
    // }
  },

   // 提示需要授权
   showneedlogin(){
    wx.showToast({
      title: '返回首页底部点击-我的-进行注册/登陆',
      icon: 'none',
      duration: 2000,
      mask: true,
  })
   },
  
  // 搜索按钮
  searchclick: function (e) {
    if (this.data.currentTab == 0) {
      if(app.globalData.UserLogin){
        this.getarticles()
      }else{
          // 提示需要授权
         this.showneedlogin()
      }
    } else if (this.data.currentTab == 1) {
      if(app.globalData.UserLogin){
        this.getmyfollow()
      }else{
          // 提示需要授权
          this.showneedlogin()
      }
    }

  },
  // 获取文章列表
  getarticles() {
    var that = this;
    this.setData({
      result_show: true
    })
    console.log(loginInfo._openid)
    console.log(that.data.searchValue)
    wx.cloud.callFunction({
      name: 'articles',
      data: {
        type: 'getarticles',
        searchValue: that.data.searchValue,
        loginUserId:loginInfo._openid
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        // wx.showToast({
        //   title: '获取文章列表成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        // 前端处理点赞总数 去点赞数组的长度
        res.result.list.map(item => {
          item.likesum = item.likesumarr.length
        })
        // this.setData({
        //   articlesList: res.result.list,
        // });
        that.fillData(true, res.result.list)
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
  fillData: function (isFull, goods) {
    let view = this.selectComponent('#waterFallView');
    view.fillData(isFull, goods);
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

  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current == '0') {
      if(app.globalData.UserLogin){
      this.searchclick()
    }else{
      // 提示需要授权
      this.showneedlogin()
  }
    } else if (e.detail.current == '1') {
      if(app.globalData.UserLogin){
        this.getmyfollow()
      }else{
          // 提示需要授权
          this.showneedlogin()
      }
     
    }
  },

});