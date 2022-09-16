const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型

module.exports = sequelize.define("banner", {
    // 字段
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
})

