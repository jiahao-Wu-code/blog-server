const jwt = require('jsonwebtoken');
const md5 = require('md5');
const multer = require('multer');
const path = require("path");
const { UploadError } = require('./error')

module.exports.formatResponse = function (code, msg, data) {
    return {
        code,
        msg,
        data
    }
}

// 解析token
module.exports.parseToken = function (token) {
    return jwt.verify(token.split(' ')[1], md5(process.env.JWT_SECRET))
}

// 处理数组类型数据

module.exports.parseData = function (data) {
    return data.map(item => item.dataValues);
}


// 设置上传文件引擎

const storage = multer.diskStorage({
    // 文件存储位置
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/static/uploads');
    },
    // 上传到服务器文件名处理
    filename: function (req, file, cb) {
        // 获取文件名
        const basename = path.basename(file.originalname, path.extname(file.originalname))
        // 获取后缀名
        const extname = path.extname(file.originalname)
        // 构建新的文件名
        const newName = `${basename}-${new Date().getTime()}-${Math.floor(Math.random() * 9000 + 1000).toString(36).slice(-6)}${extname}`;
        cb(null, newName)
    }
})

module.exports.uploading = multer({
    storage: storage,
    limits: {
        files: 1
    },
})