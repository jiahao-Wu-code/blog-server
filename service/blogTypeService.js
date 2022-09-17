const { validate } = require("validate.js");
const { addBlogTypeDao, getAllBlogTypeDao, getOneBlogTypeDao, UpdateOneBlogTypeDao, deleteOneBlogTypeDao } = require("../dao/blogTypeDao");
const { ValidateError } = require("../utils/error");
const { formatResponse, parseData } = require("../utils/tool");


// 新增一个分类
module.exports.addBlogTypeService = async function (newBlogTypeInfo) {
    // 数据验证规则
    const blogTypeRule = {
        name: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        },
        order: {
            presence: {
                allowEmpty: false,
            },
            type: "string",
        }
    }
    // 进行数据验证
    const validateResult = validate.validate(newBlogTypeInfo, blogTypeRule);
    if (!validateResult) {
        // 验证通过
        newBlogTypeInfo.articleCount = 0;
        const data = await addBlogTypeDao(newBlogTypeInfo)
        return formatResponse(0, "", data)
    } else {
        //验证失败
        throw new ValidateError("数据验证失败")
    }
}

// 获取所有分类
module.exports.getAllBlogTypeService = async function () {
    const res = await getAllBlogTypeDao()
    // 更具 order 排序
    return formatResponse(200, "", parseData(res)).data.sort((a, b) => a.order - b.order)
}

// 获取某个分类
module.exports.getOneBlogTypeService = async function (id) {
    const { dataValues } = await getOneBlogTypeDao(id)
    return formatResponse(200, "", dataValues)

}
// 修改某个分类
module.exports.updateOneBlogTypeService = async function (id, blogTypeInfo) {
    const data = await UpdateOneBlogTypeDao(id, blogTypeInfo)
    return formatResponse(200, "", data)
}
// 删除某个分类
module.exports.deleteOneBlogTypeService = async function (id) {
    await deleteOneBlogTypeDao(id);
    return formatResponse(200, "", true)
}