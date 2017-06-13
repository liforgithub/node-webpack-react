/**
 * Created by 李雪洋 on 2017/5/10.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = require("../../service/user/UserService");
class UserController {
    static loginCheck(req, res) {
        UserService_1.default.login(req.body.userName, req.body.password, data => {
            let d = {
                userName: data["userName"],
                nickName: data["nickName"],
                authority: data["authority"],
            };
            console.log(d);
            res.json({
                result: data["result"],
                data: d
            });
        });
    }
}
exports.default = UserController;
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
//# sourceMappingURL=UserController.js.map