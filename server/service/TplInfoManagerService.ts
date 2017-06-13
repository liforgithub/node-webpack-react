/**
 * Created by 李雪洋 on 2017/5/19.
 */
import TbTplInfo from '../db/dbExecute/TbTplInfo'

export default class TplInfoManagerService {

    static queryList(req, callback) {

        (async () => {
            let count = await TbTplInfo.count(req);
            let list = await TbTplInfo.queryList(req);

            callback({
                result: "ok",
                msg: {
                    totalCount: count,
                    aData: list
                }
            });
        })()
    }

    static saveData(req, callback) {

        (async () => {
            let json = await TbTplInfo.saveData(req);
            callback(json);
        })()
    }

}