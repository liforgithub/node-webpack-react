"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/5/19.
 */
const TbTplInfo_1 = require("../db/dbExecute/TbTplInfo");
class TplInfoManagerService {
    static queryList(req, callback) {
        (async () => {
            let count = await TbTplInfo_1.default.count(req);
            let list = await TbTplInfo_1.default.queryList(req);
            callback({
                result: "ok",
                msg: {
                    totalCount: count,
                    aData: list
                }
            });
        })();
    }
    static saveData(req, callback) {
        (async () => {
            let json = await TbTplInfo_1.default.saveData(req);
            callback(json);
        })();
    }
}
exports.default = TplInfoManagerService;
//# sourceMappingURL=TplInfoManagerService.js.map