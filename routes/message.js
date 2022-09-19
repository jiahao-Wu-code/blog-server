const express = require('express');
const { addMessageService, getMessageByPageService, deleteMessageService } = require('../service/messageService');
const router = express.Router();

// 分页获取留言 或 评论
router.get('/', async (req, res, next) => {
    res.send(await getMessageByPageService(req.query))
})

// 新增留言 或 评论
router.post('/', async (req, res, next) => {
    res.send(await addMessageService(req.body));
})

// 删除留言 或 评论

router.delete('/:id', async (req, res, next) => {
    res.send(await deleteMessageService(req.params.id))
})
module.exports = router;