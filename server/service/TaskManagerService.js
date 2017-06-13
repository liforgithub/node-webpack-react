"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/5/14.
 */
const TbProcessInfo_1 = require("../db/dbExecute/TbProcessInfo");
const sendmail_1 = require("../util/sendmail");
const TbUser_1 = require("../db/dbExecute/TbUser");
class TaskManagerService {
    static saveData(req, callback) {
        (async () => {
            let json = await TbProcessInfo_1.default.saveData(req);
            let mailAddr = await TbUser_1.default.queryUserMailAddress(req.body.opt_name == req.body.create_name ? req.body.execute_name : req.body.create_name);
            let content = "";
            if (req.body.flow_id != '') {
                content = "更新" + "\n" + req.body.tpl_id + "\n" + req.body.tpl_name + "\n" + (req.body.cx_or_cz == 1 ? "查询" : "充值") + "\n" + (req.body.hf_or_sdm ? "话费" : "水电煤") + "任务状态为" + (req.state == 1 ? "处理中" : (req.state == 2 ? "已完成" : "废弃"));
            }
            else {
                if (req.body.task_type == 1) {
                    content = "维护" + "\n" + req.body.tpl_id + "\n" + req.body.tpl_name + "\n";
                }
                else {
                    content = "开发" + "\n" + req.body.tpl_name + "\n" + (req.body.cx_or_cz == 1 ? "查询" : "充值") + "\n" + (req.body.hf_or_sdm ? "话费" : "水电煤");
                }
            }
            let params = {
                mailAddr: mailAddr,
                content: content,
                title: req.body.flow_id != '' ? "外挂单状态更新提醒" : "外挂" + (req.body.task_type == 1 ? "维护" : "开发") + "单提醒"
            };
            await sendmail_1.default.sendMailTo(params);
            callback(json);
        })();
    }
    static queryList(req, callback) {
        (async () => {
            let count = await TbProcessInfo_1.default.count(req);
            let list = await TbProcessInfo_1.default.queryList(req);
            callback({
                result: "ok",
                msg: {
                    totalCount: count,
                    aData: list
                }
            });
        })();
    }
    static deleteTask(req, callback) {
        (async () => {
            let json = await TbProcessInfo_1.default.deleteTask(req);
            let mailAddr = await TbUser_1.default.queryUserMailAddress(req.body.execute_name);
            let content = "删除" + "\n" + req.body.tpl_name + "\n" + (req.body.cx_or_cz == 1 ? "查询" : "充值") + "\n" + (req.body.hf_or_sdm ? "话费" : "水电煤");
            let params = {
                mailAddr: mailAddr,
                content: content,
                title: "外挂单删除提醒",
            };
            await sendmail_1.default.sendMailTo(params);
            callback(json);
        })();
    }
    static queryUserList(callback) {
        (async () => {
            let list = await TbUser_1.default.queryUserList();
            callback({
                result: "ok",
                msg: list
            });
        })();
    }
}
exports.default = TaskManagerService;
//# sourceMappingURL=TaskManagerService.js.map