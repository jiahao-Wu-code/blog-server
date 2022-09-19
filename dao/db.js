const sequelize = require("./dbConnect");
const adminModel = require("./Model/adminModel");
const bannerModel = require("./Model/bannerModel");
const blogTypeModel = require("./Model/blogTypeModel");
const blogModel = require("./Model/blogModel");
const projectModel = require("./Model/projectModel");
const messageModel = require("./Model/messageModel");

const md5 = require("md5");
(async function () {
    // 定义模型之间的关系

    // 博客 和 博客类型
    blogTypeModel.hasMany(blogModel, {
        foreignKey: "categoryId",
        targetKey: "id"
    })

    blogModel.belongsTo(blogTypeModel, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "category"
    })

    // 评论 和 文章

    blogModel.hasMany(messageModel, {
        foreignKey: "blogId",
        target: "id",
    })

    messageModel.belongsTo(blogModel, {
        foreignKey: "blogId",
        target: "id",
        as: "blog"
    })



    // 将数据模型和表进行同步
    await sequelize.sync({
        alter: true
    })
    // 初始化数据
    const adminCount = await adminModel.count();
    // console.log('first',adminCount)
    if (!adminCount) {
        await adminModel.create({
            loginId: 'admin',
            name: 'admin',
            loginPwd: md5("123456")
        })
        console.log("初始化数据完毕");
    }

    // banner 初始化数据
    const bannerCount = await bannerModel.count();
    if (!bannerCount) {
        await bannerModel.bulkCreate([{
            img: "/static/imgs/img1.jpeg",
            title: "哆啦A梦",
            description: "生活百般滋味，人生需要笑对"
        },
        {
            img: "/static/imgs/img2.jpeg",
            title: "哆啦A梦",
            description: "生活百般滋味，人生需要笑对"
        }, {
            img: "/static/imgs/img3.jpeg",
            title: "哆啦A梦",
            description: "生活百般滋味，人生需要笑对"
        }])
        console.log("初始化首页标语数据")
    }

    console.log("数据库准备完毕")
})()