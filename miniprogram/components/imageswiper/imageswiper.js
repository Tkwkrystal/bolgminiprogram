// components/imageswiper/imageswiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,  //当前所在页面的 index

    indicatorDots: true, //是否显示面板指示点

    autoplay: true, //是否自动切换

    interval: 3000, //自动切换时间间隔

    duration: 800, //滑动动画时长

    circular: true, //是否采用衔接滑动

    // imgUrls: [

    //   'http://1027145.user-website5.com/yizhan/images-2/banner1.jpg',

    //   'http://1027145.user-website5.com/yizhan/images-2/banner2.jpg',

    //   'http://1027145.user-website5.com/yizhan/images-2/banner3.jpg'

    // ],

    links: [

      '/pages/second/register',

      '/pages/second/register',

      '/pages/second/register'

    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
 //轮播图的切换事件

 swiperChange: function(e) {

  this.setData({

    swiperCurrent: e.detail.current

  })

},

//点击指示点切换

chuangEvent: function(e) {

  this.setData({

    swiperCurrent: e.currentTarget.id

  })

},

//点击图片触发事件

swipclick: function(e) {

  console.log(this.data.swiperCurrent);

  wx.switchTab({

    url: this.data.links[this.data.swiperCurrent]

  })

}
  }
})
