"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/6/9.
 */
const nodemailer = require("nodemailer");
class SendMail {
    static sendMailTo(params) {
        return new Promise((reslove, reject) => {
            let transporter = nodemailer.createTransport({
                service: 'qq',
                auth: {
                    user: '1399925934@qq.com',
                    pass: 'qdizfcfusvcwhcdd' //授权码,通过QQ获取
                }
            });
            let mailOptions = {
                from: '1399925934@qq.com',
                to: params.mailAddr,
                subject: params.title,
                text: params.content,
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('发送成功');
                    reslove();
                }
            });
        });
    }
}
exports.default = SendMail;
//# sourceMappingURL=sendmail.js.map