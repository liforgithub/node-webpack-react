/**
 * Created by 李雪洋 on 2017/5/9.
 */
import Pool from "../DBConfig";

const pool = Pool.mysqlPool();

export default class TbUser {

    static login(userName, password) {
        return new Promise((reslove, reject) => {
            pool.getConnection((err, conn) => {
                let sql = "select * from tb_user t where t.user_name = ? and t.password = ?";
                let json = {};
                conn.query(sql, [userName, password], (err, result) => {
                    if (result && result.length > 0) {
                        json = {
                            result: "ok",
                            userName: result[0].user_name,
                            nickName: result[0].nick_name,
                            authority: result[0].authority,
                            msg: "校验成功"
                        };
                    } else {
                        json = {
                            result: "fail",
                            msg: "账号或密码错误"
                        };
                    }

                    conn.release();
                    reslove(json);
                });
            });
        })
    }

    static queryUserList() {
        return new Promise((reslove, reject) => {
            pool.getConnection( (err, conn) => {
                let sql = "select * from tb_user";
                conn.query(sql, (err, result) => {
                    console.log(result);
                    let data = [];
                    if (result) {
                        for (let i = 0; i < result.length; i++) {
                            data.push({
                                authority: result[i].authority,
                                nick_name: result[i].nick_name
                            });
                        }
                    }

                    conn.release();
                    reslove(data);
                });
            });
        })
    }

    static queryUserMailAddress(nickName) {
        return new Promise((reslove, reject) => {
            pool.getConnection( (err, conn) => {
                let sql = "select * from tb_user where nick_name = ?";
                conn.query(sql, [nickName], (err, result) => {
                    console.log(result);

                    conn.release();
                    if (result) {
                        reslove(result[0].mail_addr);
                    } else {
                        reslove("");
                    }
                });
            });
        })
    }
}