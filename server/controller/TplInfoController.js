"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/5/19.
 */
const TplInfoManagerService_1 = require("../service/TplInfoManagerService");
class TplInfoController {
    static queryList(req, res) {
        TplInfoManagerService_1.default.queryList(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        });
    }
    static saveData(req, res) {
        TplInfoManagerService_1.default.saveData(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        });
    }
}
exports.default = TplInfoController;
//# sourceMappingURL=TplInfoController.js.map