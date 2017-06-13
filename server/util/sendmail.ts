/**
 * Created by 李雪洋 on 2017/6/9.
 */
import * as nodemailer from "nodemailer";

export default class SendMail {

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
                from: '1399925934@qq.com', // 发送者
                to: params.mailAddr, // 接受者,可以同时发送多个,以逗号隔开
                subject: params.title, // 标题
                text: params.content, // 文本
                //         html: `<h2>nodemailer基本使用:</h2><h3>
                // <a href="http://blog.csdn.net/zzwwjjdj1/article/details/51878392">
                // http://blog.csdn.net/zzwwjjdj1/article/details/51878392</a></h3>`
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('发送成功');
                    reslove();
                }
            });
        })
    }
}
