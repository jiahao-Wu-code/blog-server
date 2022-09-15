const svgCaptcha = require('svg-captcha');
module.exports.getCaptchaService = async function () {
    return svgCaptcha.create({
        size: 4,
        ignoreChars: "iIl10oO",
        noise: 1,
        color: true
    })
    // console.log(cap, "capt")
}