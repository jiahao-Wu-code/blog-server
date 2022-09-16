const bannerModel = require("./Model/bannerModel")

module.exports.getBannerDao = async function () {
    return await bannerModel.findAll()
}

module.exports.updateBannerDao = async function (bannerInfo) {
    await bannerModel.destroy({
        truncate: true
    });

    await bannerModel.bulkCreate(bannerInfo);
    return await bannerModel.findAll()
}