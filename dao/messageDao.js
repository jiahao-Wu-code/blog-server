const blogModel = require("./Model/blogModel")
const messageModel = require("./Model/messageModel")
const { Op } = require("sequelize")


// 新增留言 或 评论
module.exports.addMessageDao = async function (newMessage) {
    return await messageModel.create(newMessage)
}

// 分页获取留言 或 评论

module.exports.getMessageByPageDao = async function (pageInfo) {
    // 需要根据 blogid 来判断
    console.log("blogid", pageInfo);

    if (pageInfo.blogid) {
        // 获取评论
        if (pageInfo.blogid === "all") {
            // 返回所有评论
            return await messageModel.findAndCountAll({
                offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
                limit: pageInfo.limit * 1,
                where: {
                    blogid: {
                        [Op.ne]: null
                    }
                },
                include: [{
                    model: blogModel,
                    as: "blog"
                }]
            })
        } else {
            // 返回对应文章评论
            return await messageModel.findAndCountAll({
                offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
                limit: pageInfo.limit * 1,
                where: {
                    blogid: pageInfo.blogid * 1
                },
                order: [
                    ["createDate", "DESC"]
                ]
            })
        }
    } else {
        // 获取留言
        return await messageModel.findAndCountAll({
            offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
            limit: pageInfo.limit * 1,
            where: {
                blogid: null
            },
            order: [
                ["createDate", "DESC"]
            ]
        })
    }
}


// 删除留言 或 评论

module.exports.deleteMessageDao = async function (id) {
    await messageModel.destroy({
        where: {
            id,
        }
    })
}