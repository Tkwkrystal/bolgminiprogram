// pages/publishBlog/publishBlog.js
const {
    formatTime
} = require("../../utils/util.js")

let imginfo = []
let detail
let delimgList =[]//要删除的图片列表
let temimgList =[]//临时的图片列表

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEdit: false,
        currentWordNumber:0,
        // 导航栏标题
        NavigationBarTitle: '上传blog',
        // 渲染输入框
        InputList: [{
            'id': 'title',
            'title': '标题:',
            'placeholder': '请填写标题内容',
            'type': 'text',
            'maxlength': 20,
            'tag':'input'
        },
        {
            'id': 'introduction',
            'title': '简介:',
            'placeholder': '请填写具体介绍',
            'type': 'text',
            'maxlength': 200,
            'tag':'textarea'
        }],

        // 表单数据
        FormData: {
            // 标题
            'title': '',
            // 简介
            'introduction': '',
        },
        // 照片列表
        imgList: [],
        modalName: null,
         // 标签选择
         checkbox: [{
            value: 1,
            name: 'vue',
            checked: false
        }, {
            value: 2,
            name: 'node',
            checked: false
        }, {
            value: 3,
            name: 'react',
            checked: false
        }, {
            value: 4,
            name: '前端',
            checked: false
        }, {
            value: 5,
            name: '后端',
            checked: false
        }, {
            value: 6,
            name: 'php',
            checked: false
        }, {
            value: 7,
            name: 'java',
            checked: false
        }, {
            value: 8,
            name: '其他',
            checked: false
        }],
  
        // 标签的显示
        displayTags: '',
        // 临时变量
        templeCheckbox: [],
        templeTags: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        if(e.hasOwnProperty('detail')){
            this.data.isEdit = true
            // 查询blog详细信息
            detail = JSON.parse(e.detail)
            imginfo = detail.FormData.imginfo
         // 修改checkbox的显示
         let templeCheckbox = this.data.checkbox
         for (let i = 0; i < templeCheckbox.length; i++) {
            if (detail.FormData.Tags.includes(templeCheckbox[i].name)) {
                templeCheckbox[i].checked = !templeCheckbox[i].checked;
            }
        }
        this.setData({
            FormData: detail.FormData,
            displayTags: detail.FormData.Tags.join(','),
            imgList: detail.photoInfo,
            checkbox: templeCheckbox,
            templeCheckbox:templeCheckbox,
            templeTags:detail.FormData.Tags,
            isEdit:this.data.isEdit
        })
        }
      
        // 修改导航栏样式
        // wx.setNavigationBarColor({
        //     frontColor: '#ffffff',
        //     backgroundColor: e.backgroundcolor,
        //     animation: {
        //         duration: 400,
        //         timingFunc: 'easeIn'
        //     }
        // })
      
    },

    // 获取输入框数据
    InputData: function (e) {
        console.log(e, e.currentTarget.id, e.detail.value)
        let FormData = this.data.FormData
        let id = e.currentTarget.id
        let value = e.detail.value
        
        FormData[id] = value
        this.setData({
            FormData,
            currentWordNumber: parseInt(value.length) //当前字数  
        })
    },


    // 选择照片
    ChooseImage() {
        let that = this
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: async (res) => {
                console.log(res)
                // 判断是不是上传的第一张照片
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
                for (let i = 0; i < res.tempFilePaths.length; i++) {
                    let resinfo = await that.getimginfo(res.tempFilePaths[i])

                    imginfo = imginfo.concat(resinfo)
                }
           

                // console.log('imgList',this.data.imgList)
                // console.log('imginfo',imginfo)
            }
        });
    },
// 获取图片信息
    getimginfo(sor){
        return new Promise((resolve, errs) => {
            wx.getImageInfo({
                src: sor,
                success (resinfo) {
                    resolve(resinfo);
                }
              })
            })
      },
      
    // 预览照片
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },

    // 删除照片
    DelImg(e) {
        wx.showModal({
            title: '提示',
            content: '确定要删除这张照片吗？',
            cancelText: '取消',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    let index = e.currentTarget.dataset.index
                    if(this.data.imgList[index].indexOf('cloud') != -1){
                        delimgList.push(this.data.imgList[index])
                    }
                    this.data.imgList.splice(index, 1);
                    // 记录图片信息 尺寸：宽高
                    imginfo.splice(index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })

                    console.log('imgList',this.data.imgList)
                    console.log('imginfo',imginfo)
                    console.log('delimgList',delimgList)

                }
            }
        })
    },

   // 显示弹窗
   showModal(e) {
    console.log('0.showModal')
    let templeCheckbox = this.data.checkbox
    this.setData({
        templeCheckbox: templeCheckbox,
        modalName: e.currentTarget.dataset.target
    })
},

   // 点击确认后保存显示confirm
   Confirm(e) {
    console.log('2.Confirm')
    let templeTags = this.data.templeTags
    let templeCheckbox = this.data.templeCheckbox
    let FormData = this.data.FormData
    FormData.Tags = templeTags
    this.setData({
        FormData: FormData,
        checkbox: templeCheckbox,
        displayTags: templeTags.join(','),
        modalName: null
    })
},

// 选择弹窗
ChooseCheckbox(e) {
    console.log('3.ChooseCheckbox')
    let strArray = []
    let templeTags = this.data.templeTags
    let templeCheckbox = this.data.templeCheckbox

    console.log('templeCheckbox', templeCheckbox[0].checked)

    let values = e.currentTarget.dataset.value
    let name = e.currentTarget.dataset.name

    console.log('values', values, 'name', name, templeTags.includes(name))

    // 只能选4个标签
    if (templeTags.length < 4) {
        // 修改checkbox的显示
        for (let i = 0; i < templeCheckbox.length; i++) {
            if (templeCheckbox[i].value == values) {
                templeCheckbox[i].checked = !templeCheckbox[i].checked;
                break;
            }
        }
    } else if (templeTags.length >= 4) {
        // 超过四个标签后，只能取消，不能继续选
        if (templeTags.includes(name)) {
            // 修改checkbox的显示
            for (let i = 0; i < templeCheckbox.length; i++) {
                if (templeCheckbox[i].name == values) {
                    templeCheckbox[i].checked = !templeCheckbox[i].checked;
                    break;
                }
            }
        } else {
            wx.showToast({
                title: '最多只能选4个',
                icon: 'none'
            })
        }
    }

    // 实时显示
    for (let i = 0; i < templeCheckbox.length; i++) {
        if (templeCheckbox[i].checked) {
            strArray.push(templeCheckbox[i].name)
        }
    }

    console.log(strArray, templeCheckbox)

    // 存在临时的变量，点击确认后再保存显示
    this.setData({
        templeTags: strArray,
        templeCheckbox: templeCheckbox
    })

},
   

    // 提交信息前进行数据校验
    Submit(e) {
        let ImgList = this.data.imgList
        let FormData = this.data.FormData
        let InputList = this.data.InputList
            FormData.imginfo = imginfo

        // 表单数据的校验
        for (let key in FormData) {
            if (FormData[key] == '') {
                wx.showToast({
                    title: '请把所有数据填写完整',
                    icon: 'none',
                    mask: true,
                    duration: 2000
                })
                return;
            }
        }

        console.log(ImgList.length)

        // 图片的校验
        // 图片为空时报错
        if (ImgList.length == 0) {
            wx.hideLoading()
            wx.showToast({
                title: '图片不能为空,最少需要一张',
                icon: 'none',
                mask: true,
                duration: 2000
            })
            return;
        }
        // 图片超过四张保错
        if (ImgList.length > 4) {
            wx.hideLoading()
            wx.showToast({
                title: '图片不能超过四张',
                icon: 'none',
                mask: true,
                duration: 2000
            })
            return;
        }

        this.setData({
            FormData: FormData
        })

        // 上传图片
        this.UploadImages()
    },


    // 上传图片
    UploadImages() {
        wx.showLoading({
            title: '保存图片...',
            mask: true
        })
        let that = this
        let imgPathList = []
      
        // 保存照片
        for (let i = 0; i < that.data.imgList.length; i++) {
            if(that.data.imgList[i].indexOf('cloud') != -1){
                imgPathList.push(that.data.imgList[i])
                if (imgPathList.length == that.data.imgList.length) {
                    wx.hideLoading()
                    // 保存信息
                    that.SubmitEntrust(imgPathList)
                }
            }else{
                const fileName = that.data.imgList[i];
                const dotPosition = fileName.lastIndexOf('.');
                const extension = fileName.slice(dotPosition);
                const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`;
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath: fileName,
                    success(res) {
                        console.log('imgs', res, imgPathList.length, that.data.imgList.length)
                        imgPathList.push(res.fileID)
                        temimgList.push(res.fileID)
                        if (imgPathList.length == that.data.imgList.length) {
                            wx.hideLoading()
                            // 保存信息
                            that.SubmitEntrust(imgPathList)
                        }
                    },
                    fail: err => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '图片保存失败',
                            icon: "none",
                            duration: 1500
                        })
                    },
                    complete: res => { }
                })
            }
          
        }
    },

    // 提交信息
    SubmitEntrust(photoInfo) {
        wx.showLoading({
            title: '上传blog中...',
            mask: true
        })
        let FormData = this.data.FormData
        let EntrustType = this.data.FormData.Tags.join(',')
        let that = this

        if(this.data.isEdit){
            wx.cloud.callFunction({
                name: 'blogs',
                data: {
                    type: 'updatablog',
                    _id: detail._id,
                    EntrustType: EntrustType,
                    FormData: FormData,
                    photoInfo: photoInfo,
                    updateTime: formatTime(new Date())
                },
                success: res => {
                    wx.hideLoading()
                    if(res.result.stats.updated == 1){
                        wx.showToast({
                            title: '更新blog成功',
                            icon: 'success',
                            duration: 2000
                        })
                        console.log('delimgList',delimgList)
                        if(delimgList.length>0){
                            // 把更新成功，删除 编辑页面删除的已经上传的图片
                            wx.cloud.deleteFile({
                                fileList: delimgList,
                                success: res => {
                                    // handle success
                                    console.log('delimages', res.fileList)

                                    // 跳转回我的页面
                                    wx.reLaunch({
                                        url: '../mypage/mypage'
                                    })
                                },
                                fail: console.error
                            })
                        }else{
                               // 跳转回我的页面
                                    wx.reLaunch({
                                        url: '../mypage/mypage'
                                    })
                        }
                    }        
                },
                fail: err => {
                    wx.hideLoading()
                    console.log(err)
                    wx.showToast({
                        title: '更新blog失败',
                        icon: 'success',
                        duration: 2000
                    })
                    // 把更新失败，但已经上传的图片删除
                    wx.cloud.deleteFile({
                        fileList: temimgList,
                        success: res => {
                            // handle success
                            console.log('delimages', res.fileList)
                        },
                        fail: console.error
                    })
                },
                complete: res => {
                    // console.log(res)
                   
                }
            })
        }else{
            var userInfo = wx.getStorageSync('userInfo')
            wx.cloud.callFunction({
                name: 'articles',
                data: {
                    type: 'add',
                    openid:userInfo._openid,
                    EntrustType: EntrustType,
                    FormData: FormData,
                    photoInfo: photoInfo,
                    publishTime: formatTime(new Date())
                },
                success: res => {
                    wx.hideLoading()
                    console.log(res)
                    wx.showToast({
                        title: '上传blog成功',
                        icon: 'success',
                        duration: 2000
                    })
                   // 页面跳转到成功页面
                    wx.switchTab({
                      url: '../mypage/mypage',
                    })
                },
                fail: err => {
                    wx.hideLoading()
                    console.log(err)
                    wx.showToast({
                        title: '上传blog失败',
                        icon: 'success',
                        duration: 2000
                    })
                    // 把已经上传的图片删除
                    wx.cloud.deleteFile({
                        fileList: photoInfo,
                        success: res => {
                            // handle success
                            console.log('delimages', res.fileList)
                        },
                        fail: console.error
                    })
                },
                complete: res => {
                    console.log(res)
                }
            })
        }
    
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
        delimgList =[]
        temimgList =[]
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