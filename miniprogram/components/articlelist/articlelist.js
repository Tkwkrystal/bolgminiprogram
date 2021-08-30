// components/articlelist/articlelist.js
var app = getApp()

var leftList = new Array();//左侧集合
var rightList = new Array();//右侧集合
var leftHight = 0, rightHight = 0, itemWidth = 0, maxHeight = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // articlesList:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftList: [],//左侧集合
    rightList: [],//右侧集合
    centent_Show:true,
    leftHeight:240,
    rightHeight:240

  },
  attached: function () {
    wx.getSystemInfo({
      success: (res) => {
        let percentage = 750 / res.windowWidth;
        let margin = 30 / percentage;
        itemWidth = (res.windowWidth - margin) / 2;
        maxHeight = itemWidth / 0.8
      }
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点赞
    clickDianzan(e){
      // const { articlesList } = this.properties


      if(app.globalData.UserLogin){
        let id = Number(e.currentTarget.dataset.index)
        let leftorright = e.currentTarget.dataset.leftorright
          // 前端数组改变数据 - 点赞状态/点赞总数 
          if(leftorright == 'left'){
            if(leftList[id].like_status == 1){
              leftList[id].like_status = 2
              leftList[id].likesum -= 1
            }else{
              leftList[id].like_status = 1
              leftList[id].likesum += 1
            }
          }else{
            if(rightList[id].like_status == 1){
              rightList[id].like_status = 2
              rightList[id].likesum -= 1
            }else{
              rightList[id].like_status = 1
              rightList[id].likesum += 1
            }
          }
        
        // 点赞数据库like添加记录
        wx.cloud.callFunction({
          name: 'articles',
          data: {
              type: 'dianzan',
              articleId: e.currentTarget.dataset.article,
              authorId: e.currentTarget.dataset.author,
              userId: app.globalData.userInfo._openid,
              dianzan: leftorright == 'left'?leftList[id].like_status:rightList[id].like_status,
              likes:leftorright == 'left'?leftList[id].like:rightList[id].like
          },
          success: res => {
              wx.hideLoading()
              if(leftorright == 'left'){
                wx.showToast({
                  title: leftList[id].like_status == 1 ? '点赞成功' : '取消赞成功',
                  icon: 'success',
                  duration: 2000
              })
              this.setData({
                leftList:leftList
              })
              }else{
                wx.showToast({
                  title: rightList[id].like_status == 1 ? '点赞成功' : '取消赞成功',
                  icon: 'success',
                  duration: 2000
              })
              this.setData({
                rightList:rightList
              })
              }
            
            
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
      }else{
           // 提示需要授权
      wx.showToast({
        title: '返回首页底部点击-我的-进行注册/登陆',
        icon: 'none',
        duration: 2000,
        mask: true,
    })
      }

   
      
    },
        // 跳到详情页函数
        NavigateToDetail: function (e) {
          let globalData = app.globalData
          let UserLogin = globalData.UserLogin
          if (UserLogin) {
            let url = '../../pages/blogDetail/blogDetail'
            let articleid = e.currentTarget.dataset.id
              wx.navigateTo({
                  url: `${url}?articleid=${articleid}`,
              })
          } else {
              // 提示登录
              wx.showToast({
                  title: '你还未登录，请先到个人中心登录！',
                  icon: 'none',
                  duration: 2500,
                  mask: true,
              })
          }
      },

      fillData: function (isPull, listData) {
        if (isPull) { //是否下拉刷新，是的话清除之前的数据
          leftList.length = 0;
          rightList.length = 0;
          leftHight = 0;
          rightHight = 0;
        }
        if(listData.length == 0 ){
          this.setData({
            centent_Show: false,
          });
          this.setData({
            leftList: [],
            rightList: [],
          });
        }else{
          this.setData({
            centent_Show: true,
          });
          for (let i = 0, len = listData.length; i < len; i++) {
            let tmp = listData[i];
            tmp.width = parseInt(tmp.FormData.imginfo[0].width);
            tmp.height = parseInt(tmp.FormData.imginfo[0].height);
            tmp.itemWidth = itemWidth
            let per = tmp.width / tmp.itemWidth;
            tmp.itemHeight = tmp.height / per;
            // if (tmp.itemHeight > maxHeight) {
            //   tmp.itemHeight = maxHeight;
            // }
            
            if (leftHight == rightHight) {
              leftList.push(tmp);
              leftHight = leftHight + tmp.itemHeight + 74;
            } else if (leftHight < rightHight) {
              leftList.push(tmp);
              leftHight = leftHight + tmp.itemHeight + 74;
            } else {
              rightList.push(tmp);
              rightHight = rightHight + tmp.itemHeight + 74;
            }
          }

    
          this.setData({
            leftList: leftList,
            rightList: rightList,
            rightHeight:rightHight,
            leftHeight:leftHight
          });
        }
   
        
      },

        // 跳转他人主页
gootheruser(e){
  if(app.globalData.UserLogin){
    let url = '../otherpage/otherpage'
    let id = e.currentTarget.dataset.followerid
        wx.navigateTo({
            url: `${url}?id=${id}`,
        })
  }else{
      // 提示需要授权
      wx.showToast({
        title: '返回首页底部点击-我的-进行注册/登陆',
        icon: 'none',
        duration: 2000,
        mask: true,
    })
  }
 
},
  },
    
})
