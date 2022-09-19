const jwt = require('jsonwebtoken');
const md5 = require('md5');
const multer = require('multer');
const path = require("path");
const toc = require("markdown-toc");

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

// 文件上传
module.exports.uploading = multer({
    storage: storage,
    limits: {
        files: 1
    },
})

// 处理TOC目录

module.exports.parseTOC = function (info) {
    let res = toc(info.markdownContent).json;
    // console.log("res", res)
    // [
    //     {
    //         content: '浅析 v-modelv-mode',
    //         slug: '浅析-v-modelv-mode',
    //         lvl: 2,
    //         i: 0,
    //         seen: 0
    //     },
    //     { content: '思路整', slug: '思路整', lvl: 3, i: 1, seen: 0 },
    //     { content: 'Observer', slug: 'observer', lvl: 4, i: 2, seen: 0 },
    //     { content: 'Dep', slug: 'dep', lvl: 4, i: 3, seen: 0 }
    // ]

    // 需要转成的格式
    // [  // 目录
    //     { "name": "章节1", "anchor": "title-1" },
    //     {
    //         "name": "章节2", "anchor": "title-2",
    //         "children": [
    //             { "name": "章节2-1", "anchor": "title-2-1" },
    //             { "name": "章节2-2", "anchor": "title-2-2" },
    //         ]
    //     }
    // ],

    function transfer(arr) {
        const stack = [];
        const result = [];

        let min = 6;
        // 找到最小标题等级
        for (const i of arr) {
            if (i.lvl < min) {
                min = i.lvl;
            }
        }
        //创建 TOC 对象
        function createTOCItem(item) {
            return {
                name: item.content,
                anchor: item.slug,
                level: item.lvl,
                children: []
            }
        }

        function handleItem(item) {
            const top = stack[stack.length - 1];
            if (!top) {
                stack.push(item);
            } else if (item.level > top.level) {
                top.children.push(item);
                stack.push(item);
            } else {
                stack.pop()
                handleItem(item);
            }
        }

        for (const item of arr) {
            const tocItem = createTOCItem(item);
            if (tocItem.level === min) {
                result.push(tocItem);
            }
            handleItem(tocItem);
        }
        return result
    }
    info.toc = transfer(res)

    // console.log("first", info.toc)
    delete info.markdownContent;

    for (const i of res) {
        switch (i.lvl) {
            case 1: {
                const newStr = `<h1 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace("<h1>", newStr);
                break;
            }
            case 2: {
                const newStr = `<h2 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace("<h2>", newStr);
                break;
            }
            case 3: {
                const newStr = `<h3 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace("<h3>", newStr);
                break;
            }
            case 4: {
                const newStr = `<h4 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace("<h4>", newStr);
                break;
            }
            case 5: {
                const newStr = `<h5 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace("<h5>", newStr);
                break;
            }
            case 6: {
                const newStr = `<h6 id="${i.slug}">`
                info.htmlContent = info.htmlContent.replace("<h6>", newStr);
                break;
            }
        }
    }

    return info;

}