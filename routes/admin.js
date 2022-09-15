const express = require('express');
const router = express.Router();
const { loginService, updateAdminService } = require('../service/adminService');
const { formatResponse, parseToken } = require('../utils/tool');

// 登录
router.post('/login', async function (req, res, next) {
    const result = await loginService(req.body);
    if (result.token) {
        res.setHeader('authentication', result.token);
    }
    res.send(formatResponse(200, "", result.data))
});

// 恢复登录

router.get("/whoami", async (req, res, next) => {
    // 1. 从客户端的请求拿到 token 解析token
    const token = parseToken(req.get("Authorization"));
    // 2. 返回给客户端
    res.send(formatResponse(200, "", {
        id: token.id,
        loginId: token.loginId,
        name: token.name,
    }))

    // console.log("token", token,)
})

// 更新管理员信息

router.put("/", async (req, res, next) => {
    res.send(await updateAdminService(req.body))
})

module.exports = router;
