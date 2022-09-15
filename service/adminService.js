// admin 模块的业务逻辑层

const md5 = require('md5');
const jwt = require("jsonwebtoken")
const { loginDao, updateAdminDao } = require('../dao/adminDao');
const { ValidateError } = require('../utils/error');
const { formatResponse } = require('../utils/tool');
// 登录
module.exports.loginService = async function (loginInfo) {
    // 加密
    loginInfo.loginPwd = md5(loginInfo.loginPwd);
    // 数据验证，查询数据库
    let data = await loginDao(loginInfo)
    // 找到数据
    if (data && data.dataValues) {
        data = {
            id: data.dataValues.id,
            name: data.dataValues.name,
            loginId: data.dataValues.loginId,
        };
        let loginPeriod = null;
        if (loginInfo.remember) {
            loginPeriod = loginInfo.remember;
        } else {
            loginPeriod = 1;
        }
        const token = jwt.sign(data, md5(process.env.JWT_SECRET), { expiresIn: 60 * 60 * 24 * loginPeriod })
        return {
            token,
            data
        }
    }
    return {
        data
    }
}
// 更新

module.exports.updateAdminService = async function (accountInfo) {
    // 1. 根据传入账号信息查询对应账户，使用旧密码
    const adminInfo = await loginDao({
        loginId: accountInfo.loginId,
        loginPwd: md5(accountInfo.oldLoginPwd),
    })
    // console.log("adminInfo", adminInfo)
    if (adminInfo && adminInfo.dataValues) {
        // 信息正确，修改
        const newPwd = md5(accountInfo.loginPwd)
        await updateAdminDao({
            loginId: accountInfo.loginId,
            loginPwd: newPwd,
            name: accountInfo.name,
        })
        // console.log('reasult', reasult)
        return formatResponse(0, "修改成功", {
            loginId: accountInfo.loginId,
            name: accountInfo.name,
            id: adminInfo.dataValues.id
        })
    } else {
        // 旧密码错误
        throw new ValidateError('旧密码不正确')
    }
}