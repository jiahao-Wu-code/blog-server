// 这一层 负责和数据库操作

const adminModel = require("./Model/adminModel");

// 登录

module.exports.loginDao = async function (loginInfo) {
    return await adminModel.findOne({
        where: {
            loginId: loginInfo.loginId,
            loginPwd: loginInfo.loginPwd
        }
    });
}

// 更新
module.exports.updateAdminDao = async function (newAccountInfo) {
    return await adminModel.update(newAccountInfo, {
        where: {
            loginId: newAccountInfo.loginId,
        }
    })

}