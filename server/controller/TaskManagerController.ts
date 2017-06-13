/**
 * Created by 李雪洋 on 2017/5/15.
 */
import TaskManagerService from "../service/TaskManagerService"

export default class TaskManagerController {

    static saveData(req, res) {

        TaskManagerService.saveData(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            })
        });
    }

    static queryList(req, res) {

        TaskManagerService.queryList(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            })
        })
    }

    static deleteTask(req, res) {

        TaskManagerService.deleteTask(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        })
    }

    static queryUserList(req, res) {

        TaskManagerService.queryUserList( data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            });
        })
    }
}
