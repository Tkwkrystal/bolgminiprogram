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
    // 获取我的关注列表
    if (event.type === 'getmyfollow') {
     
      const myfollowlist = await db.collection('user_relation')
      .aggregate()
      .match({
        user_id: event.userid,
        relation_type: '1'
      })
      .lookup({
        from: 'user',
        let: {
            myfollow: '$follower_id',
        },
        pipeline: $.pipeline()
              .match(_.expr($.and([
                $.eq(['$_openid', '$$myfollow'])
            ])))
            .done(),
        as: 'followarr',
        })
        .lookup({
          from: 'likes',
          let: {
              author: '$follower_id',
          },
          pipeline: $.pipeline()
                .match(_.expr($.and([
                  $.eq(['$author_id', '$$author']),
                  $.eq(['$like_status', 1])
              ])))
              .done(),
          as: 'likessumarr',
          })
        .end()

    return myfollowlist
  }
// 获取粉丝列表
  if (event.type === 'getmyfanlist') {
     
    const myfanslist = await db.collection('user_relation')
    .aggregate()
    .match({
      follower_id: event.userid,
      relation_type: '1'
    })
    .lookup({
      from: 'user',
      let: {
          myfan: '$user_id',
      },
      pipeline: $.pipeline()
            .match(_.expr($.and([
              $.eq(['$_openid', '$$myfan'])
          ])))
          .done(),
      as: 'myfanarr',
      })
      .lookup({
        from: 'likes',
        let: {
            author: '$user_id',
        },
        pipeline: $.pipeline()
              .match(_.expr($.and([
                $.eq(['$author_id', '$$author']),
                $.eq(['$like_status', 1])
            ])))
            .done(),
        as: 'likessumarr',
        })
      .end()

  return myfanslist
}
     // 搜索用户列表
     if (event.type === 'searchuser') {
       if(event.searchValue == '' || !event.hasOwnProperty('searchValue')){
        const myfollowlist = await db.collection('user')
        .aggregate()
        .lookup({
          from: 'user_relation',
          let: {
              userid: '$_openid',
              loginid: event.loginid
          },
          pipeline: $.pipeline()
                .match(_.expr($.and([
                  $.eq(['$follower_id', '$$userid']),
                  $.eq(['$user_id', '$$loginid']),
                  $.eq(['$relation_type', '1'])
              ])))
              .done(),
          as: 'followarr',
          })
          .lookup({
            from: 'likes',
            let: {
                author: '$openid',
            },
            pipeline: $.pipeline()
                  .match(_.expr($.and([
                    $.eq(['$author_id', '$$author']),
                    $.eq(['$like_status', 1])
                ])))
                .done(),
            as: 'likessumarr',
            })
          .end()
  
      return myfollowlist
       }else{
        const myfollowlist = await db.collection('user')
        .aggregate()
        .match({
          "nickName": db.RegExp({
            regexp: event.searchValue,
            options: 'i', //大小写不区分
          })
        })
        .lookup({
          from: 'user_relation',
          let: {
              userid: '$_openid',
              loginid: event.loginid
          },
          pipeline: $.pipeline()
                .match(_.expr($.and([
                  $.eq(['$follower_id', '$$userid']),
                  $.eq(['$user_id', '$$loginid']),
                  $.eq(['$relation_type', '1'])
              ])))
              .done(),
          as: 'followarr',
          })
          .lookup({
            from: 'likes',
            let: {
                author: '$openid',
            },
            pipeline: $.pipeline()
                  .match(_.expr($.and([
                    $.eq(['$author_id', '$$author']),
                    $.eq(['$like_status', 1])
                ])))
                .done(),
            as: 'likessumarr',
            })
          .end()
  
      return myfollowlist
       }
    
  }
  //获取当前用户 关注/粉丝/获赞
  if (event.type === 'getmyfans') {
    const follows = await db.collection('user_relation').where({
      user_id: event.userid, // 填入当前用户 openid
      relation_type: '1'
    }).count()

    const fans = await db.collection('user_relation').where({
      follower_id: event.userid, // 填入当前用户 openid
      relation_type: '1'
    }).count()

    const likes = await db.collection('likes').where({
      author_id: event.userid, // 填入当前用户 openid
      like_status: 1
    }).count()

    let info ={
      follows:follows.total,
      fans:fans.total,
      likes:likes.total
    }

  return info
  }
   //删除自己的文章 
   if (event.type === 'deletemyblog') {
    const deldata = await db.collection('articles').doc(event.articleid).remove()
    const deldatalike = await db.collection('likes').where({article_id:event.articleid}).remove()

    return Object.assign( {} , deldata, deldatalike)
  }


      // 更新文章
      if (event.type === 'updatablog') {
        let EntrustType = event.EntrustType
        let FormData = event.FormData
        let photoInfo = event.photoInfo
        let updateTime = event.updateTime
        return await db.collection(dbname).where({
          _id: event._id
        }).update({
            data: {
                photoInfo: photoInfo,
                FormData: FormData,
                EntrustType: EntrustType,
                updateTime: updateTime,
            }
        })
    }
}