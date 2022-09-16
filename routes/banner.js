const express = require('express');
const { getBannerService, updateBannerService } = require('../service/bannerService');
const router = express.Router();

// 获取首页标语
router.get('/', async (req, res, next) => {
    res.send(await getBannerService());
})

// 上传首页标语
router.post('/', async (req, res, next) => {
    res.send(await updateBannerService(req.body));
})

module.exports = router;