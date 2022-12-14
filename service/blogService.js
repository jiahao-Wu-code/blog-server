const { validate } = require("validate.js");
const { addBlogDao, getBlogByPageDao, getBlogByIdDao, updateOneBlogDao, deleteOneBlogDao } = require("../dao/blogDao");
const { getOneBlogTypeDao } = require("../dao/blogTypeDao");
const { deleteCommentByBlogIdDao } = require("../dao/messageDao");
const blogTypeModel = require("../dao/Model/blogTypeModel");
const { ValidateError, NotFoundError } = require("../utils/error");
const { formatResponse, parseData, parseTOC } = require("../utils/tool");
const { addBlogNumber } = require("./blogTypeService");

// 新增一个博客
module.exports.addBlogService = async function (newBlogInfo) {
    // 处理文章TOC
    newBlogInfo = parseTOC(newBlogInfo);
    newBlogInfo.toc = JSON.stringify(newBlogInfo.toc)
    // console.log("newBlogInfo", newBlogInfo)

    // newBlogInfo.toc = JSON.stringify('["a":"b"]');

    // 初始化文章信息

    newBlogInfo.scanNumber = 0;
    newBlogInfo.commentNumber = 0;

    // 定义验证规则

    const blogRule = {
        title: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        description: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        toc: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        htmlContent: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        thumb: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        scanNumber: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        commentNumber: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        createDate: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        categoryId: {
            presence: true,
            type: "integer",
        }
    }

    // 数据验证
    // 验证规则中含有异步规则
    try {
        const res = await blogTypeModel.findByPk(newBlogInfo.categoryId);
        if (!res) {
            throw new ValidateError('Category not found');
        }
        await validate.validate(newBlogInfo, blogRule);
        const data = await addBlogDao(newBlogInfo);
        data.toc = JSON.parse(data.toc);
        // 文章类型下面文章数要自增
        await addBlogNumber(newBlogInfo.categoryId);
        return formatResponse(200, "", data)
    }
    catch (e) {
        console.log("e-->", e);
        throw new ValidateError("数据验证失败")
    }

}

// 分页获取博客
module.exports.getBlogByPageService = async function (pageInfo) {
    let { count, rows } = await getBlogByPageDao(pageInfo);
    rows.map(r => r.toc = JSON.parse(r.toc))
    rows = parseData(rows)
    return formatResponse(200, "", {
        total: count,
        rows
    })
}

// // 获取某篇文章
module.exports.getOneBlogByIdService = async function (id, auth) {
    const data = await getBlogByIdDao(id);
    if (!data) {
        throw new NotFoundError('未找到')
    }
    data.dataValues.toc = JSON.parse(data.dataValues.toc);
    // 浏览数自增处理
    if (!auth) {
        data.scanNumber++;
        await data.save();
    }
    return formatResponse(200, "", data.dataValues)
}

// // 修改某个文章
module.exports.updateOneBlogService = async function (id, newBlogInfo) {
    // TOC目录处理
    if (newBlogInfo.htmlContent) {
        newBlogInfo = parseTOC(newBlogInfo);
        newBlogInfo.toc = JSON.stringify(newBlogInfo.toc)
    }

    // 修改文章分类是，对应文章数需要变化

    const { dataValues: oldBlogInfo } = await getBlogByIdDao(id)
    // 修改了博客分类
    if (newBlogInfo.categoryId !== oldBlogInfo.categoryId) {
        const oldBlogTypeInfo = await getOneBlogTypeDao(oldBlogInfo.categoryId);
        oldBlogTypeInfo.articleCount--
        await oldBlogInfo.save()

        const newBlogTypeInfo = await getOneBlogTypeDao(newBlogInfo.categoryId);
        newBlogTypeInfo.articleCount++
        await newBlogTypeInfo.save()


    }

    const { dataValues } = await updateOneBlogDao(id, newBlogInfo);
    // console.log("toc", dataValues.toc);
    dataValues.toc = JSON.parse(dataValues.toc);
    return formatResponse(200, "", dataValues)


}
// 删除某个文章
module.exports.deleteBlogService = async function (id) {
    const data = await getBlogByIdDao(id);
    // console.log("data", data)
    const categoryInfo = await getOneBlogTypeDao(data.dataValues.categoryId);
    // console.log("categoryInfo", categoryInfo)
    categoryInfo.articleCount--;
    await categoryInfo.save();
    // TODO: 评论删除
    await deleteCommentByBlogIdDao(id)
    await deleteOneBlogDao(id)
    return formatResponse(200, "", true)

}