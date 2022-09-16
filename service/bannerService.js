const { getBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { parseData, formatResponse } = require("../utils/tool");

module.exports.getBannerService = async function () {
    return formatResponse(200, "", parseData(await getBannerDao()))
}

module.exports.updateBannerService = async function (bannerInfo) {
    return formatResponse(200, "", parseData(await updateBannerDao(bannerInfo)))
}