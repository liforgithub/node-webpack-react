/**
 * 返回RawBody
 * @param req
 * @returns {Promise<any>}
 */
function getReqRawBody(req): Promise<any> {
    return new Promise((resolve, reject) => {
        req.setEncoding('utf8');
        let _rawBody = "";
        req.on('data', function (chunk) {
            _rawBody += chunk;
        });

        req.on('end', function () {
            resolve(_rawBody);
        })
    })
}

export default {getReqRawBody};
export {getReqRawBody};
