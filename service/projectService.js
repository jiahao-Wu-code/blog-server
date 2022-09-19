const { validate } = require("validate.js");
const { addProjectDao, getAllProjectDao, updateOneProjectDao, deleteOneProjectDao } = require("../dao/projectDao");
const { formatResponse, parseData } = require("../utils/tool");
const { ValidateError } = require("../utils/error");

// 新增一个项目
module.exports.addProjectService = async function (newProjectInfo) {
    newProjectInfo.description = JSON.stringify(newProjectInfo.description);
    // console.log("newProjectInfo", newProjectInfo);
    const projectRule = {
        name: {
            presence: {
                allowEmpty: false,
            },
            type: "string"
        },
        description: {
            presence: {
                allowEmpty: false,
            },
            type: "string"
        },
        url: {
            presence: {
                allowEmpty: false,
            },
            type: "string"
        },
        github: {
            presence: {
                allowEmpty: false,
            },
            type: "string"
        },
        thumb: {
            type: "string"
        },
        order: {
            presence: {
                allowEmpty: false,
            },
            type: "integer"
        }
    }
    const validateResult = validate.validate(newProjectInfo, projectRule);
    console.log("validateResult", validateResult);
    if (!validateResult) {
        const data = await addProjectDao(newProjectInfo);
        return formatResponse(200, "", [data])
    }
    else {
        throw new ValidateError("数据验证失败")
    }

}

// 获取所有项目
module.exports.getAllProjectService = async function () {
    const data = await getAllProjectDao();
    // console.log("data", data.dataValues);
    return formatResponse(200, "success", parseData(data))
}

// 修改某个项目
module.exports.updateOneProjectService = async function (id, newProjectInfo) {
    newProjectInfo.description = JSON.stringify(newProjectInfo.description);
    const data = await updateOneProjectDao(id, newProjectInfo)
    // console.log("data", data)
    return formatResponse(200, "success", data)
}
// 删除某个分类
module.exports.deleteProjectService = async function (id) {
    await deleteOneProjectDao(id);
    return formatResponse(200, "success", true)
}