const express = require("express");
const { UploadError } = require('../utils/error');
const { uploading, formatResponse } = require('../utils/tool');
const multer = require("multer")
const router = express.Router();
router.post('/', async function (req, res, next) {
    // single 方法里面书写上传控件的 name 值
    uploading.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            next(new UploadError("上传文件太大了，文件最大1M"))
        } else {
            const path = "/static/upload/" + req.file.filename;
            res.send(formatResponse(200, "", path))
        }
    })
})

module.exports = router; 