/**
 * Created by lixueyang on 2017/5/5.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XML2JS = require("xml2js");
const logger_1 = require("./logger");
/**
 *
 * @param xmlContent  XML格式数据
 * @returns {Promise<>}
 */
function parse2Json(xmlContent) {
    return new Promise((resolve, reject) => {
        XML2JS.parseString(xmlContent, { explicitArray: false, ignoreAttrs: true }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.xml);
            }
        });
    });
}
exports.parse2Json = parse2Json;
function buildXML(data) {
    const builder = new XML2JS.Builder({ rootName: "xml", cdata: true });
    const xml = builder.buildObject(data);
    logger_1.default.info(xml);
    return xml;
}
exports.buildXML = buildXML;
exports.default = { parse2Json, buildXML };
//# sourceMappingURL=xml-util.js.map