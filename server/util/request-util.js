"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 返回RawBody
 * @param req
 * @returns {Promise<any>}
 */
function getReqRawBody(req) {
    return new Promise((resolve, reject) => {
        req.setEncoding('utf8');
        let _rawBody = "";
        req.on('data', function (chunk) {
            _rawBody += chunk;
        });
        req.on('end', function () {
            resolve(_rawBody);
        });
    });
}
exports.getReqRawBody = getReqRawBody;
exports.default = { getReqRawBody };
//# sourceMappingURL=request-util.js.map