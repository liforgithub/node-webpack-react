/**
 * Created by 李雪洋 on 2017/5/10.
 */
import TbUser from "../../db/dbExecute/TbUser"

export default class UserService {

    static login(userName, password, callback) {

        (async () => {
            let json = await TbUser.login(userName, password);
            callback(json);
        })()
    }
}