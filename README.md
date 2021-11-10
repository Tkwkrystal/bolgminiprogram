# 基于微信小程序云开发-文章类发布社交平台（小红书）
[TOC]

项目地址：https://github.com/Tkwkrystal/bolgminiprogram


***如需小程序定制「包括但不限于课设、毕设等」可联系我:***

> 发现有问题？欢迎加我微信一起探讨，或者直接提Issues
> 
> 联系方式🛰️：CoCo-Tang727

<img src="https://img-blog.csdnimg.cn/17ec29de8318457fa84a96dc96eb5ca6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width="30%" alt="二维码"></img>

- [其他开源项目]

1. 个人博客 PC&H5（前台+前台管理+后台）:https://github.com/Tkwkrystal/vue-react-node
2. vue管理系统模板：https://github.com/Tkwkrystal/vue-admin-template


## 项目简介

本项目是2021年8月份左右的产物，开发用来记录文章，以及blog。配以图文的方式，简单直接展示，并附有点赞，关注，上传等基础功能。

> 项目虽然没有做的很完整，但是整体的数据架构还算是可以的，可以很容易进行功能完善和添加新功能。

记录一下自己的项目，由于之前自己ECS已到期，PC版&&H5版的博客不能够再使用（但源码还在github保留，需要的朋友[请点击这里](https://github.com/Tkwkrystal/vue-react-node)），小程序于今日又非常的火爆，方便使用以及记录，便开启了这个项目。话不多说，下面就只进进入正题。

> 本程序已经经过测试，拿来按照说明简单配置就可以直接使用,界面可以自己进行修改。
由于本人的能力有限，还有很多地方没法完善，望指正！

## 目录结构

```
|--|-- cloudfunctions 云函数
|--|-- miniprogram 小程序页面
|--|--|--dist 一些用到的组件，只用到了一小部分
|--|--|--pages 主包（主要是底部NaviBar页面）
|--|--|--|--略
|--|--其他页面略
|--README.md
|--图片（项目截图）
```

## 功能说明

1. 页面展示
2. 搜索
3. 点赞
4. 关注
5. 上传，编辑，删除


## 配置过程

1. 直接下载源码,源码地址：https://github.com/Tkwkrystal/bolgminiprogram
或者clone项目 git clone https://github.com/Tkwkrystal/bolgminiprogram.git

2. 打开微信开发者工具，导入项目（导入的时候请选择 APP 文件夹）；

3. 填写APPID；

4. 开通云开发环境（请参考官方文档）；

5. 新建以下数据库集合,一行为一个集合名（不要写错）：

```
    articles
    blogs
    likes
    user
    user-relation
```


6. 上传 `cloudfunctions` 文件夹下所有的云函数，上传时选择 `上传并部署：云端安装依赖`；

7. 修改 `app.js` 大约第8行的代码，如下：

```javascript
    wx.cloud.init({
        env: '(填写你自己云环境的ID)',
        traceUser: true,
    })
```

8. 编译运行。

## 界面预览

<img src="https://img-blog.csdnimg.cn/aa30476e0afa46488a0819b958381f20.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" style="" width = "30%" alt="首页" align=left>
<img src="https://img-blog.csdnimg.cn/2f5e74bd8a944864a793ea504af956ba.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width = "30%" alt="我的" align=left>
<img src="https://img-blog.csdnimg.cn/506fb57b0194418aad1b27cea8a97120.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width = "30%" alt="他人主页" align=left>
<img src="https://img-blog.csdnimg.cn/08ccb0b348f54e109f55c47a238cb0ae.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width = "30%" alt="搜索" align=left>
<img src="https://img-blog.csdnimg.cn/90d8eb9c70694519a37c50130051bea6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width = "30%" alt="详情" align=left>
<img src="https://img-blog.csdnimg.cn/5533ee77e5e04903a81952d774840bd5.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width = "30%" alt="上传" >



## 参考文档

- [个人开发详细文档介绍](https://blog.csdn.net/qq_39868515/article/details/120011469)

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


# sketch原型设计
<img src="https://img-blog.csdnimg.cn/a73440e8c1044df983e7b2bfe6ffdc3e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center"></img>

## 结语

我已将全部资源上传至git，如果你觉得对您有一点点帮助，您可以给我点一个start，或者赞赏我，感谢！

<img src="https://img-blog.csdnimg.cn/b7aa87a2659c4c069d6b74ae79a2dac8.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAS3J5c3RhbC1Db29s,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center" width="400" height="400"/>

## 作者

by author CoCo-Tang727 
2021.09.02











