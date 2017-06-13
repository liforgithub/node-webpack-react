"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/5/15.
 */
const TaskManagerService_1 = require("../service/TaskManagerService");
class TaskManagerController {
    static saveData(req, res) {
        TaskManagerService_1.default.saveData(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        });
    }
    static queryList(req, res) {
        TaskManagerService_1.default.queryList(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        });
    }
    static deleteTask(req, res) {
        TaskManagerService_1.default.deleteTask(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        });
    }
    static queryUserList(req, res) {
        TaskManagerService_1.default.queryUserList(data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        });
    }
}
exports.default = TaskManagerController;
//# sourceMappingURL=TaskManagerController.js.map