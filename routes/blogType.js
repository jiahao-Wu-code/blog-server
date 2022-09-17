const express = require('express');
const { addBlogTypeService, getAllBlogTypeService, getOneBlogTypeService, updateOneBlogTypeService, deleteOneBlogTypeService } = require('../service/blogTypeService');
const router = express.Router()

// 添加 博客分类
router.post('/', async function (req, res, next) {
    res.send(await addBlogTypeService(req.body))
});


// 获取所有 博客分类
router.get('/', async function (req, res, next) {
    res.send(await getAllBlogTypeService())
});


// 获取某个博客分类
router.get('/:id', async function (req, res, next) {
    res.send(await getOneBlogTypeService(req.params.id))
});


// 修改某个 博客分类
router.put('/:id', async function (req, res, next) {
    res.send(await updateOneBlogTypeService(req.params.id, req.body))
});


// 删除某个 博客分类
router.delete('/:id', async function (req, res, next) {
    res.send(await deleteOneBlogTypeService(req.params.id))
});


module.exports = router