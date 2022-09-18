const express = require('express');
const { addBlogService, getBlogByPageService, getOneBlogByIdService, updateOneBlogService, deleteBlogService } = require('../service/blogService');
const { deleteOneBlogTypeService } = require('../service/blogTypeService');
const router = express.Router()

// 添加 博客 
router.post('/', async function (req, res, next) {
    res.send(await addBlogService(req.body))
});


// 分页获取 博客 
router.get('/', async function (req, res, next) {
    res.send(await getBlogByPageService(req.query))
});


// 获取某个博客
router.get('/:id', async function (req, res, next) {
    const reqHeaders = req.headers;
    res.send(await getOneBlogByIdService(req.params.id,reqHeaders.authorization));
});


// 修改某个 博客
router.put('/:id', async function (req, res, next) {
    res.send(await updateOneBlogService(req.params.id,req.body));
});


// 删除某个 博客
router.delete('/:id', async function (req, res, next) {
    res.send(await deleteBlogService(req.params.id));
});


module.exports = router