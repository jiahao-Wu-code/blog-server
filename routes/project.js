const express = require('express');
const { addProjectService, getAllProjectService, updateOneProjectService, deleteProjectService } = require('../service/projectService');
const router = express.Router()

// 添加 项目 
router.post('/', async function (req, res, next) {
    res.send(await addProjectService(req.body))
});

// 获取所有项目
router.get('/', async function (req, res, next) {
    res.send(await getAllProjectService());
});


// 修改某个 项目
router.put('/:id', async function (req, res, next) {
    res.send(await updateOneProjectService(req.params.id, req.body));
});


// 删除某个 项目
router.delete('/:id', async function (req, res, next) {
    res.send(await deleteProjectService(req.params.id));
});


module.exports = router