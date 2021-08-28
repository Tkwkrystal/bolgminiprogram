// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const dbname = 'articles'

    // 用户保存自己的委托
    if (event.type === 'add') {
        let EntrustType = event.EntrustType
        let FormData = event.FormData
        let photoInfo = event.photoInfo
        let publishTime = event.publishTime
        return await db.collection(dbname).add({
            data: {
                open_id: event.openid,
                photoInfo: photoInfo,
                FormData: FormData,
                EntrustType: EntrustType,
                publish: true,
                publishTime: publishTime,
                checkedBy: '',
                checkedTime: '',
                title: '',
                plate: '',
                publishPlate: '',
                charge: {
                    'name': '',
                    'phone': ''
                },
                updateTime: '',
                recommendData: {
                    "Isrecommend": false,
                    "recommender": "",
                    "updatetime": ""
                }
            }
        })
    }

    // 用户查看自己的委托
    if (event.type === 'MyEntrust') {
        const EntrustList = await db.collection(dbname).orderBy('updateTime', 'desc').where({
            '_openid': openId,
            'EntrustType': event.key
        }).field({
            _id: true,
            EntrustType: true,
            checkedBy: true,
            checkedTime: true,
            publish: true,
            publishTime: true,
            updateTime: true,
            title: true,
            'FormData.detailLocation': true,
            'FormData.houseStyle': true
        }).get()
        return EntrustList
    }

    // 管理员获取用户的委托
    if (event.type === 'AllEntrust') {
        let IsPublish = event.IsPublish
        const EntrustList = await db.collection(dbname).orderBy('updateTime', 'desc').where({
            'publish': IsPublish
        }).field({
            _id: true,
            plate: true,
            publishPlate: true,
            EntrustType: true,
            checkedBy: true,
            checkedTime: true,
            publish: true,
            publishTime: true,
            updateTime: true,
            title: true,
            'FormData.detailLocation': true,
            'FormData.name': true,
            'FormData.phonenumber': true
        }).get()
        return EntrustList
    }

    // 详细信息
    if (event.type === 'EntrustDetail') {
        let id = event.id
        const EntrustList = await db.collection(dbname)
            .orderBy('updateTime', 'desc')
            .where({
                '_id': id
            }).get()
        return EntrustList
    }

    // 获取articles列表
    if (event.type === 'getarticles') {
        if (event.hasOwnProperty('tag')) {
            if (event.tag == '全部') {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList
            } else {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .match({
                        EntrustType: db.RegExp({
                            regexp: event.tag,
                            options: 'i', //大小写不区分
                        })
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList

            }
        } else {
            // searchValue 判断是否是搜索内容
            if (event.searchValue == '' || !event.hasOwnProperty('searchValue')) {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList

            } else {
                const EntrustList = await db.collection('articles')
                    .aggregate()
                    .sort({
                        updateTime: -1,
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                            use_id: event.loginUserId
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$user_id', '$$use_id'])
                            ])))
                            .project({
                                like_status: 1,
                            })
                            .done(),
                        as: 'likestatus',
                    })
                    .lookup({
                        from: 'likes',
                        let: {
                            art_id: '$_id',
                        },
                        pipeline: $.pipeline()
                            .match(_.expr($.and([
                                $.eq(['$article_id', '$$art_id']),
                                $.eq(['$like_status', 1])
                            ])))
                            .done(),
                        as: 'likesumarr',
                    })
                    .lookup({
                        from: 'user',
                        localField: 'open_id',
                        foreignField: '_openid',
                        as: 'user',
                    })
                    .match({
                        "FormData.title": db.RegExp({
                            regexp: event.searchValue,
                            options: 'i', //大小写不区分
                        })
                    })
                    .replaceRoot({
                        newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
                    })
                    .project({
                        likestatus: 0
                    })
                    .end()

                return EntrustList

            }
        }


    }
    // 查询自己的文章列表
    if (event.type === 'getmyarticles') {
        const EntrustList = await db.collection('articles')
        .aggregate()
        .sort({
            updateTime: -1,
        })
        .match({
            open_id: event.userid
        })
        .lookup({
            from: 'likes',
            let: {
                art_id: '$_id',
                use_id: event.userid
            },
            pipeline: $.pipeline()
                .match(_.expr($.and([
                    $.eq(['$article_id', '$$art_id']),
                    $.eq(['$user_id', '$$use_id'])
                ])))
                .project({
                    like_status: 1,
                })
                .done(),
            as: 'likestatus',
        })
        .lookup({
            from: 'likes',
            let: {
                art_id: '$_id',
            },
            pipeline: $.pipeline()
                .match(_.expr($.and([
                    $.eq(['$article_id', '$$art_id']),
                    $.eq(['$like_status', 1])
                ])))
                .done(),
            as: 'likesumarr',
        })
        .lookup({
            from: 'user',
            localField: 'open_id',
            foreignField: '_openid',
            as: 'user',
        })
        .replaceRoot({
            newRoot: $.mergeObjects([$.arrayElemAt(['$likestatus', 0]), '$$ROOT'])
        })
        .project({
            likestatus: 0
        })
        .end()

    return EntrustList
    }

    // 点赞
    if (event.type === 'dianzan') {

        // 点赞 ：先查表里有无 文章id 与 用户id同时匹配的点赞 状态
        const dianzanList = await db.collection('likes')
            .orderBy('updateTime', 'desc')
            .where({
                'user_id': event.userId,
                'article_id': event.articleId
            }).get()


        // 无： 给点赞表里加一条数据：文章id 点赞id 以及 点赞状态1
        // 有：改点赞状态
        if (dianzanList.data.length > 0) {

            return await db.collection('likes').where({
                'user_id': event.userId,
                'article_id': event.articleId
            }).update({
                data: {
                    like_status: event.dianzan
                }
            })
        } else {
            return await db.collection('likes').add({
                data: {
                    user_id: event.userId,
                    article_id: event.articleId,
                    author_id: event.authorId,
                    like_status: 1
                }
            })
        }

    }

    // 关注
    if (event.type === 'guanzhu') {

        // 关注 ：先查表里有无 user_id 与 follower_id同时匹配的数据 状态
        const dianzanList = await db.collection('user_relation')
            .orderBy('updateTime', 'desc')
            .where({
                'user_id': event.userId,
                'follower_id': event.followerId
            }).get()


        // 无： 给用户关系表里加一条数据：用户id 被关注id 以及 关系状态 1-已关注 2-关注取消
        // 有：改点赞状态
        if (dianzanList.data.length > 0) {
            return await db.collection('user_relation').where({
                'user_id': event.userId,
                'follower_id': event.followerId
            }).update({
                data: {
                    relation_type: event.guanzhu ? '2':'1'
                }
            })
        } else {
            return await db.collection('user_relation').add({
                data: {
                    user_id: event.userId,
                    follower_id: event.followerId,
                    relation_type: '1'
                }
            })
        }

    }

}