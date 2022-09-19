const { validate } = require("validate.js")
const { ValidateError, UnknownError } = require("../utils/error");
const fs = require("fs");
const { addMessageDao, getMessageByPageDao, deleteMessageDao } = require("../dao/messageDao");
const { formatResponse, parseData } = require("../utils/tool");
const { getBlogByIdDao } = require("../dao/blogDao");
const dir = './public/static/avatar'


async function readDirLength(dir) {

    return new Promise(resolve => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                throw new UnknownError();
            }
            resolve(files);
        })
    })
}


// 新增留言 或 评论
module.exports.addMessageService = async function (newMessage) {
    // 数据验证规则
    const messageRule = {
        nickname: {
            presence: {
                allowEmpty: false,
            },
            type: "string"
        },
        content: {
            presence: {
                allowEmpty: false,
            },
            type: "string"
        },
        blogId: {
            type: "string"
        },
    }

    const validateResult = validate.validate(newMessage, messageRule);
    if (!validateResult) {
        // 验证通过

        // 是否有 blogId 
        newMessage.blogId = newMessage.blogId ? newMessage.blogId : null;

        newMessage.createDate = Date.now();

        // 读取头像目录
        const files = await readDirLength(dir)
        //[ 'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg' ]

        const randomIndex = Math.floor(Math.random() * files.length);
        newMessage.avatar = `/static/avatars/${files[randomIndex]}`;

        // 数据库新增留言 或 评论
        const { dataValues } = await addMessageDao(newMessage)
        console.log("newMessage", newMessage.blogId)
        // 如果是评论，文章下面的评论数需要自增
        if (newMessage.blogId) {
            const blogInfo = await getBlogByIdDao(newMessage.blogId);
            console.log("blogInfo", blogInfo.commentNumber)
            blogInfo.commentNumber++;
            await blogInfo.save();
        }
        return formatResponse(200, "success", dataValues)

    } else {
        throw new ValidateError("数据验证失败")
    }

}

// 分页获取 留言 或 评论
module.exports.getMessageByPageService = async function (pageInfo) {
    // console.log("blogId", pageInfo);

    const data = await getMessageByPageDao(pageInfo);
    // console.log("data", data)
    return formatResponse(200, "success", {
        total: data.total,
        rows: parseData(data.rows)
    })
}

// 删除留言 或 评论
module.exports.deleteMessageService = async function (id) {
    await deleteMessageDao(id);
    return formatResponse(200, "success", true)
}