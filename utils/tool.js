const jwt = require('jsonwebtoken');
const md5 = require('md5');

module.exports.formatResponse = function (code, msg, data) {
    return {
        code,
        msg,
        data
    }
}


module.exports.parseToken = function (token) {
    return jwt.verify(token.split(' ')[1],md5(process.env.JWT_SECRET))
}