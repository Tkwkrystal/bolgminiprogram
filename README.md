# 基于微信小程序云开发-文章类发布社交平台（小红书）
[TOC]

项目地址：https://github.com/Tkwkrystal/bolgminiprogram


***如需小程序定制「包括但不限于课设、毕设等」可联系我:***

> 发现有问题？欢迎加我微信一起探讨，或者直接提Issues
> 无法下载或者下载太慢？可以直接找我要安装包；
> 
> 联系方式🛰️：CoCo-Tang727

![zanshang](https://tkwblog.oss-cn-beijing.aliyuncs.com/mycode)

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

<img src="https://tkwblog.oss-cn-beijing.aliyuncs.com/minprogram/home" style="" width = "50%" alt="首页" align=center>
<img src="https://tkwblog.oss-cn-beijing.aliyuncs.com/minprogram/my" width = "50%" alt="我的" align=center>
<img src="https://tkwblog.oss-cn-beijing.aliyuncs.com/minprogram/otherpage" width = "50%" alt="他人主页" align=center>
<img src="https://tkwblog.oss-cn-beijing.aliyuncs.com/minprogram/searchblog" width = "50%" alt="搜索" align=center>
<img src="https://tkwblog.oss-cn-beijing.aliyuncs.com/minprogram/detail" width = "50%" alt="详情" align=center>
<img src="https://tkwblog.oss-cn-beijing.aliyuncs.com/minprogram/public" width = "50%" alt="上传" align=center>

## 结语

欢迎一起探讨，如果你觉得还可以，您可以给我点一个start，或者赞赏我
![zanshang](https://tkwblog.oss-cn-beijing.aliyuncs.com/pay.jpg)


# 参考文档

- [个人开发详细文档介绍](https://blog.csdn.net/qq_39868515/article/details/120011469)

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码







