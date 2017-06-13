"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/5/10.
 */
const TbUser_1 = require("../../db/dbExecute/TbUser");
class UserService {
    static login(userName, password, callback) {
        (async () => {
            let json = await TbUser_1.default.login(userName, password);
            callback(json);
        })();
    }
}
exports.default = UserService;
//# sourceMappingURL=UserService.js.map