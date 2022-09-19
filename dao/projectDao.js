const projectModel = require("./Model/projectModel");


// 添加 博客
module.exports.addProjectDao = async function (newProjectInfo) {
    const { dataValues } = await projectModel.create(newProjectInfo);
    dataValues.description = JSON.parse(dataValues.description);
    return dataValues;
}

// 获取所有项目

module.exports.getAllProjectDao = async function () {
    return await projectModel.findAll();
}



// 修改某个项目
module.exports.updateOneProjectDao = async function (id, newProjectInfo) {
    await projectModel.update(newProjectInfo, {
        where: {
            id,
        }
    });
    return await projectModel.findByPk(id)
}

// 删除某个 项目
module.exports.deleteOneProjectDao = async function (id) {
    await projectModel.destroy({
        where: {
            id
        }
    })
} 