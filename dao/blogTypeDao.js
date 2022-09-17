const blogTypeModel = require('./Model/blogTypeModel');

// 添加博客分类
module.exports.addBlogTypeDao = async function (newBlogTypeInfo) {
    const { dataValues } = await blogTypeModel.create(newBlogTypeInfo)
    return dataValues;
}

// 获取所有博客分类
module.exports.getAllBlogTypeDao = async function () {
    return await blogTypeModel.findAll();
}

// 获取某个博客分类
module.exports.getOneBlogTypeDao = async function (id) {
    return await blogTypeModel.findByPk(id)
}

// 修改某个博客分类
module.exports.UpdateOneBlogTypeDao = async function (id, newBlogTypeInfo) {
    await blogTypeModel.update(newBlogTypeInfo, {
        where: {
            id
        }
    })

    const { dataValues } = await blogTypeModel.findByPk(id)
    return dataValues
}

//删除博客分类
module.exports.deleteOneBlogTypeDao = async function (id) {
    return await blogTypeModel.destroy({
        where: {
            id
        }
    })
}