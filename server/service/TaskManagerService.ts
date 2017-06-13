/**
 * Created by 李雪洋 on 2017/5/14.
 */
import TbProcessInfo from '../db/dbExecute/TbProcessInfo'
import SendMail from "../util/sendmail";
import TbUser from "../db/dbExecute/TbUser";

export default class TaskManagerService {

    static saveData(req, callback) {

        (async () => {
            let json = await TbProcessInfo.saveData(req);

            let mailAddr = await TbUser.queryUserMailAddress(req.body.opt_name == req.body.create_name ? req.body.execute_name : req.body.create_name);

            let content = "";
            if (req.body.flow_id != '') {
                content = "更新" + "\n" + req.body.tpl_id + "\n" + req.body.tpl_name + "\n" + (req.body.cx_or_cz == 1 ? "查询": "充值") + "\n" + (req.body.hf_or_sdm ? "话费": "水电煤") + "任务状态为" + (req.state == 1 ? "处理中" : (req.state == 2 ? "已完成" : "废弃"));
            } else {
                if (req.body.task_type == 1) {
                    content = "维护" + "\n" + req.body.tpl_id + "\n" + req.body.tpl_name + "\n";
                } else {
                    content = "开发" + "\n" + req.body.tpl_name + "\n" +  (req.body.cx_or_cz == 1 ? "查询": "充值") + "\n" + (req.body.hf_or_sdm ? "话费": "水电煤");
                }
            }

            let params = {
                mailAddr: mailAddr,
                content: content,
                title: req.body.flow_id != '' ? "外挂单状态更新提醒" : "外挂" + (req.body.task_type == 1 ? "维护" : "开发") + "单提醒"
            };
            await SendMail.sendMailTo(params);

            callback(json);
        })()
    }

    static queryList(req, callback) {

        (async () => {
            let count = await TbProcessInfo.count(req);
            let list = await TbProcessInfo.queryList(req);

            callback({
                result: "ok",
                msg: {
                    totalCount: count,
                    aData: list
                }
            });
        })()
    }

    static deleteTask(req, callback) {

        (async () => {
            let json = await TbProcessInfo.deleteTask(req);
            let mailAddr = await TbUser.queryUserMailAddress(req.body.execute_name);
            let content = "删除" + "\n" + req.body.tpl_name + "\n" + (req.body.cx_or_cz == 1 ? "查询": "充值") + "\n" + (req.body.hf_or_sdm ? "话费": "水电煤");

            let params = {
                mailAddr: mailAddr,
                content: content,
                title: "外挂单删除提醒",
            };
            await SendMail.sendMailTo(params);
            callback(json);
        })()
    }

    static queryUserList(callback) {

        (async () => {
           let list = await TbUser.queryUserList();
           callback({
              result: "ok",
              msg: list
           });
        })()
    }
}
