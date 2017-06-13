/**
 * Created by lixueyang on 2017/5/5.
 */


import * as XML2JS from "xml2js";
import logger from "./logger";

/**
 *
 * @param xmlContent  XML格式数据
 * @returns {Promise<>}
 */
function parse2Json(xmlContent) {
    return new Promise((resolve, reject) => {
        XML2JS.parseString(xmlContent, {explicitArray: false, ignoreAttrs: true}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.xml);
            }
        });
    });
}

function buildXML(data) {
    const builder = new XML2JS.Builder({rootName: "xml", cdata: true});
    const xml = builder.buildObject(data);
    logger.info(xml);
    return xml;
}

export default {parse2Json, buildXML}
export {parse2Json, buildXML}
