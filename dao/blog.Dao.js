const blogModel = require('./Model/blogModel');
const blogTypeModel = require('./Model/blogTypeModel');

// 添加 博客
module.exports.addBlogDao = async function (blogInfo) {
    const { dataValues } = await blogModel.create(blogInfo);
    return dataValues;
}

// 分页获取博客

module.exports.getBlogByPageDao = async function (pageInfo) {
    // { page: '1', limit: '2', category: '3' }

    if (pageInfo.categoryid && pageInfo.categoryid !== "-1") {
        // 将该分类下面的博客进行分页
        return await blogModel.findAndCountAll({
            include: [{
                model: blogTypeModel,
                as: "category",
                where: {
                    id: pageInfo.categoryid
                }
            }],
            offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
            limit: pageInfo.limit * 1
        })
    } else {
        // 将所有的博客进行分页
        return await blogModel.findAndCountAll({
            include: [{
                model: blogTypeModel,
                as: "category",
            }],
            offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
            limit: pageInfo.limit * 1
        })
    }
}

// 获取某篇博客

module.exports.getBlogByIdDao = async function (id) {
    return await blogModel.findByPk(id, {
        include: [{ model: blogTypeModel, as: "category" }],
    })
}

// 修改某个 博客
module.exports.updateOneBlogDao = async function (id, newBlogInfo) {
    await blogModel.update(newBlogInfo, { where: { id, } })
    return await blogModel.findByPk(id)
}

// 删除某个 博客
module.exports.deleteOneBlogDao = async function (id) {
    await blogModel.destroy({
        where: {
            id
        }
    })
} 