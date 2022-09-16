// 自定义错误处理
const { formatResponse } = require('./tool')
class ServiceError extends Error {
    /**
     * 
     * @param {string} message 错误消息
     * @param {number} code 错误消息码
     */
    constructor(message, code) {
        super(message);
        this.code = code;
    }

    toResponseJSON() {
        return formatResponse(this.code, this.message, null)
    }
}

// 禁止访问
exports.ForbiddenError = class extends ServiceError {
    constructor(message) {
        super(message, 401);
    }
}

exports.UploadError = class extends ServiceError {
    constructor(message) {
        super(message, 413);
    }
}

// 验证错误
exports.ValidateError = class extends ServiceError {
    constructor(message) {
        super(message, 406);
    }
}

// 无资源错误
exports.NotFoundError = class extends ServiceError {
    constructor() {
        super("not found", 404);
    }
}

// 未知错误
exports.UnknownError = class extends ServiceError {
    constructor() {
        super("server internal error", 500);
    }
}

module.exports.ServiceError = ServiceError;