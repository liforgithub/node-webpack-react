/**
 * Created by 李雪洋 on 2017/5/19.
 */
import Pool from "../DBConfig";
import UUID from "../../util/UUID"

const pool = Pool.mysqlPool();

export default class TbTplInfo {

    static queryList(req) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                let paramArray = [];
                let sql = "select * from tb_tpl_info t where 1=1";
                if (req.body.tpl_id != null && req.body.tpl_id != "") {
                    sql += " and t.tpl_id = ?";
                    paramArray.push(req.body.tpl_id);
                }
                if (req.body.cx_or_cz != 0) {
                    sql += " and t.cx_or_cz = ?";
                    paramArray.push(req.body.cx_or_cz);
                }
                if (req.body.tpl_name != null && req.body.tpl_name != "") {
                    sql += " and t.tpl_name = ?";
                    paramArray.push(req.body.tpl_name);
                }
                if (req.body.hf_or_sdm != 0) {
                    sql += " and t.hf_or_sdm = ?";
                    paramArray.push(req.body.hf_or_sdm);
                }
                if (req.body.execute_name != null && req.body.execute_name != "") {
                    sql += " and t.execute_name = ?";
                    paramArray.push(req.body.execute_name);
                }

                sql += " order by t.modify_time desc LIMIT " + req.body.pageNum * req.body.pageSize + "," + req.body.pageSize;
                conn.query(sql, paramArray, (err, result) => {
                    console.log(result);
                    let data = [];
                    if (result) {
                        for (let i = 0; i < result.length; i++) {
                            data.push(result[i]);
                        }
                    }
                    conn.release();
                    resolve(data);
                });
            });
        })
    }

    static count(req) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {

                let paramArray = [];
                let sql = "select * from tb_tpl_info t where 1=1";
                if (req.body.tpl_id != null && req.body.tpl_id != "") {
                    sql += " and t.tpl_id = ?";
                    paramArray.push(req.body.tpl_id);
                }
                if (req.body.cx_or_cz != 0) {
                    sql += " and t.cx_or_cz = ?";
                    paramArray.push(req.body.cx_or_cz);
                }
                if (req.body.tpl_name != null && req.body.tpl_name != "") {
                    sql += " and t.tpl_name = ?";
                    paramArray.push(req.body.tpl_name);
                }
                if (req.body.hf_or_sdm != 0) {
                    sql += " and t.hf_or_sdm = ?";
                    paramArray.push(req.body.hf_or_sdm);
                }
                if (req.body.execute_name != null && req.body.execute_name != "") {
                    sql += " and t.execute_name = ?";
                    paramArray.push(req.body.execute_name);
                }

                let count = 0;
                conn.query(sql, paramArray, (err, result) => {
                    count = result.length;
                    conn.release();
                    resolve(count);
                });
            });
        })
    }

    static saveData(req) {
        return new Promise((reslove, reject) => {
            pool.getConnection((err, conn) => {
                let sql = "";
                let paramArray = [];
                if (req.body.flow_id != '') {
                    console.log(req.body);
                    sql = "update tb_tpl_info t set t.tpl_id=?, t.tpl_name=?, t.wy_or_jk=?, t.cx_or_cz=?, t.hf_or_sdm=?, t.kzcz_type=?, t.create_name=?, t.execute_name=?, t.link=?, t.tpl_content=?, t.modify_time=? where t.flow_id=?";
                    paramArray.push(req.body.tpl_id);
                    paramArray.push(req.body.tpl_name);
                    paramArray.push(req.body.wy_or_jk);
                    paramArray.push(req.body.cx_or_cz);
                    paramArray.push(req.body.hf_or_sdm);
                    paramArray.push(req.body.kzcz_type);
                    paramArray.push(req.body.create_name);
                    paramArray.push(req.body.execute_name);
                    paramArray.push(req.body.link);
                    paramArray.push(req.body.tpl_content);
                    paramArray.push(new Date());
                    paramArray.push(req.body.flow_id);
                } else {
                    sql = "insert into tb_tpl_info(flow_id, tpl_id, tpl_name, wy_or_jk, cx_or_cz, hf_or_sdm, kzcz_type, create_name, execute_name, link, tpl_content, modify_time) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                    paramArray.push(UUID.getUUID());
                    paramArray.push(req.body.tpl_id);
                    paramArray.push(req.body.tpl_name);
                    paramArray.push(req.body.wy_or_jk);
                    paramArray.push(req.body.cx_or_cz);
                    paramArray.push(req.body.hf_or_sdm);
                    paramArray.push(req.body.kzcz_type);
                    paramArray.push(req.body.create_name);
                    paramArray.push(req.body.execute_name);
                    paramArray.push(req.body.link);
                    paramArray.push(req.body.task_content);
                    paramArray.push(new Date());
                }

                let json = {};
                conn.query(sql, paramArray, (err, result) => {
                    console.log("---------saveData---------");
                    console.log(result);
                    console.log("--------------------------");
                    if (result && result.affectedRows > 0) {
                        json = {
                            result: "ok",
                            msg: "操作成功"
                        };
                    } else {
                        json = {
                            result: "fail",
                            msg: "操作失败"
                        };
                    }

                    conn.release();
                    reslove(json);
                });
            });
        })
    }

}