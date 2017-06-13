/**
 * Created by 李雪洋 on 2017/5/19.
 */
import TplInfoManagerService from "../service/TplInfoManagerService"

export default class TplInfoController {

    static queryList(req, res) {

        TplInfoManagerService.queryList(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            })
        })
    }

    static saveData(req, res) {

        TplInfoManagerService.saveData(req, data => {
            console.log(data);
            res.json({
                result: data["result"],
                data: data["msg"]
            })
        })
    }
}