/**
 * Created by 李雪洋 on 2017/5/10.
 */

import UserService from "../../service/user/UserService"

export default class UserController {

    static loginCheck(req, res) {

        UserService.login(req.body.userName, req.body.password, data => {
            let d = {
                userName: data["userName"],
                nickName: data["nickName"],
                authority: data["authority"],
            };
            console.log(d);
            res.json({
                result: data["result"],
                data: d
            })
        });
    }

    // static async loginCheck(userName, password): Promise<any> {
    //     await UserService.login(userName, password)
    // }
}

// export default class UserController {
//
//     static async loginCheck(req, res): Promise<any> {
//         res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
//         await UserService.login(req.body.userName, req.body.password)
//             .then(data => {
//                 console.log('date[' + data + "]");
//                 res.json({
//                     result: "ok",
//                     data: data
//                 });
//             }).catch(err => {
//                 console.log('err[' + err.msg + "]");
//                 res.json({
//                     result: "fail",
//                     data: err.msg
//                 });
//             });
//     }
//
// }