const sequelize = require("./dbConnect");
const adminModel = require("./Model/adminModel");
const md5 = require("md5");
(async function () {
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
    console.log("数据库准备完毕")
})()